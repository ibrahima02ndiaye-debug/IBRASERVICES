
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from './common/Card';
import Button from './common/Button';
import { CpuIcon, BluetoothIcon } from './icons/Icons';

// This is a placeholder for the actual AI Diagnostics component.
// In a real application, the Gemini API calls should be made through a secure backend server.
const AIDiagnostics: React.FC = () => {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  // FIX: Replaced BluetoothDevice with 'any' due to missing web-bluetooth types.
  const [device, setDevice] = useState<any | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>(t('diagnostics.obd_not_connected'));
  const [dtcs, setDtcs] = useState<string[]>([]);
  
  useEffect(() => {
    return () => {
      // Disconnect on component unmount
      if (device?.gatt?.connected) {
        device.gatt.disconnect();
      }
    };
  }, [device]);

  const handleConnect = async () => {
    if (!('bluetooth' in navigator)) {
      setStatusMessage(t('diagnostics.obd_error_unsupported'));
      return;
    }
    setIsConnecting(true);
    setStatusMessage(t('diagnostics.obd_connecting'));
    try {
      // FIX: Cast navigator to 'any' to access the experimental bluetooth property.
      const obdScanner = await (navigator as any).bluetooth.requestDevice({
        filters: [{ services: ['00001101-0000-1000-8000-00805f9b34fb'] }], // Serial Port Profile
        optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'], // Common custom service for ELM327
      });
      
      setDevice(obdScanner);
      obdScanner.addEventListener('gattserverdisconnected', onDisconnected);
      const server = await obdScanner.gatt?.connect();
      setIsConnected(true);
      setStatusMessage(`${t('diagnostics.obd_connected_to')} ${obdScanner.name}`);
    } catch (error) {
      console.error('Bluetooth connection error:', error);
      setStatusMessage(t('diagnostics.obd_error_connection'));
    } finally {
        setIsConnecting(false);
    }
  };

  const onDisconnected = () => {
    setIsConnected(false);
    setDevice(null);
    setStatusMessage(t('diagnostics.obd_not_connected'));
    setDtcs([]);
  };

  const handleDisconnect = () => {
    device?.gatt?.disconnect();
  };

  const handleReadCodes = async () => {
    if (!device?.gatt?.connected) return;

    setIsReading(true);
    setDtcs([]);
    setStatusMessage(t('diagnostics.obd_reading_codes'));

    try {
        const server = await device.gatt.connect();
        // These UUIDs are common for ELM327 clones, may vary by device
        const service = await server.getPrimaryService('0000ffe0-0000-1000-8000-00805f9b34fb');
        const characteristic = await service.getCharacteristic('0000ffe1-0000-1000-8000-00805f9b34fb');
        
        let responseData = '';
        const decoder = new TextDecoder();
        
        const handleNotifications = (event: any) => {
            // FIX: Replaced BluetoothRemoteGATTCharacteristic with 'any'.
            const value = (event.target as any).value;
            if (value) {
                responseData += decoder.decode(value);
                // The '>' prompt character indicates the device is ready for the next command
                if (responseData.includes('>')) {
                    characteristic.removeEventListener('characteristicvaluechanged', handleNotifications);
                    parseDtcResponse(responseData);
                    setIsReading(false);
                }
            }
        };

        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleNotifications);

        const encoder = new TextEncoder();
        await characteristic.writeValue(encoder.encode('03\r')); // OBD-II command to request stored DTCs
    } catch (error) {
        console.error('Error reading DTCs:', error);
        setStatusMessage('Error reading codes.');
        setIsReading(false);
    }
  };

  const parseDtcResponse = (data: string) => {
    // Example response for '03' command: 43 01 33 00 00 00 00
    // 43 is the response for mode 03. The rest are pairs of bytes for each code.
    // NOTE: replacing \s removes newlines too, so split('\r\n') might behave unexpectedly if data relies on newlines.
    // Assuming data comes in a chunk that might have had newlines removed or we process raw.
    // For safety, we should just look for the 43... pattern in the cleaned string.
    const cleanData = data.replace(/\s/g, '').replace('>', '');
    // If newlines were removed, split won't work as expected if there were multiple lines.
    // But typically 03 response is single line or continuous stream.
    // We will treat cleanData as a potential single line response.
    const lines = cleanData.match(/43[0-9A-Fa-f]+/g);
    
    if (!lines || lines.length === 0) {
      setDtcs([]);
      setStatusMessage(t('diagnostics.obd_no_codes_found'));
      return;
    }
    
    const firstLine = lines[0];

    if (firstLine.substring(2) === '000000000000' || firstLine.length <= 2) {
      setDtcs([]);
      setStatusMessage(t('diagnostics.obd_no_codes_found'));
      return;
    }
    
    const hexCodes = firstLine.substring(2).match(/.{1,4}/g) || [];
    const parsedCodes: string[] = [];
    
    const codePrefixes = ['P', 'C', 'B', 'U'];
    hexCodes.forEach(hex => {
      if (hex === '0000') return;
      const firstChar = parseInt(hex.substring(0, 1), 16);
      const prefix = codePrefixes[firstChar >> 2];
      const restOfCode = (firstChar & 0b0011).toString(16) + hex.substring(1);
      if (prefix) {
        parsedCodes.push(`${prefix}${restOfCode.toUpperCase()}`);
      }
    });

    setDtcs(parsedCodes);
    setStatusMessage(parsedCodes.length > 0 ? t('diagnostics.obd_codes_found') : t('diagnostics.obd_no_codes_found'));
  };

  const handleDiagnose = async () => {
    if (!prompt && dtcs.length === 0) return;
    setIsLoading(true);
    setResult('');

    let fullPrompt = prompt;
    if (dtcs.length > 0) {
      const dtcString = dtcs.join(', ');
      fullPrompt = `Vehicle has stored Diagnostic Trouble Codes: ${dtcString}.\n\nSymptoms described by user: "${prompt}"`;
    }

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const aiResponse = `Based on the provided information:\n\n${dtcs.length > 0 ? `**DTCs:** ${dtcs.join(', ')}\n` : ''}**Symptoms:** "${prompt}"\n\nPossible issues could be:
1.  **Faulty Spark Plugs:** Misfiring and rough idling are common signs.
2.  **Clogged Fuel Injectors:** Can cause hesitation and poor fuel economy.
3.  **Vacuum Leak:** Often results in a high idle and a hissing sound from the engine bay.

**Recommendation:** Perform a full diagnostic scan to check for any stored error codes. Visually inspect spark plugs and check for vacuum leaks.`;
        setResult(aiResponse);

    } catch (error) {
        console.error("AI Diagnostics Error:", error);
        setResult(t('diagnostics.error'));
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Card>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-bold flex items-center gap-2"><CpuIcon /> {t('diagnostics.title')}</h2>
      </div>
      <div className="p-6 space-y-6">
        
        {/* OBD-II Section */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-3">{t('diagnostics.title')} OBD-II</h3>
            <div className="flex items-center gap-4">
                {isConnected ? (
                    <Button onClick={handleDisconnect} variant="danger" icon={<BluetoothIcon />}>
                        {t('diagnostics.obd_disconnect')}
                    </Button>
                ) : (
                    <Button onClick={handleConnect} disabled={isConnecting} icon={<BluetoothIcon />}>
                        {isConnecting ? t('diagnostics.obd_connecting') : t('diagnostics.obd_connect')}
                    </Button>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400">{statusMessage}</p>
            </div>
            {isConnected && (
                <div className="mt-4">
                    <Button onClick={handleReadCodes} disabled={isReading}>
                        {isReading ? t('diagnostics.obd_reading_codes') : t('diagnostics.obd_read_codes')}
                    </Button>
                </div>
            )}
            {dtcs.length > 0 && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
                    <h4 className="font-semibold">{t('diagnostics.obd_codes_found')}</h4>
                    <ul className="list-disc list-inside mt-2 font-mono text-sm">
                        {dtcs.map(code => <li key={code}>{code}</li>)}
                    </ul>
                </div>
            )}
        </div>

        {/* Symptoms Section */}
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-1.5">
            {t('diagnostics.describe_symptoms')}
          </label>
          <textarea
            id="symptoms"
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder={t('diagnostics.symptoms_placeholder')}
            className="w-full bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm px-3 py-2 text-gray-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
        
        <Button onClick={handleDiagnose} disabled={isLoading || (!prompt && dtcs.length === 0)} size="lg" className="w-full">
          {isLoading ? t('diagnostics.diagnosing') : t('diagnostics.run')}
        </Button>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2">{t('diagnostics.result_title')}</h3>
            <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">{result}</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AIDiagnostics;

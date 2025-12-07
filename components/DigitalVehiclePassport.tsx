import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Vehicle, Client } from '../types';
import Card from './common/Card';
import Button from './common/Button';
import { QrCodeIcon, DownloadIcon, ShareIcon, CheckCircleIcon, FileTextIcon } from './icons/Icons';
import QRCode from 'qrcode';

interface ServiceRecord {
    date: string;
    service: string;
    mileage: number;
    cost: number;
    mechanic: string;
}

interface DigitalPassportProps {
    vehicle: Vehicle;
    owner: Client;
    serviceHistory: ServiceRecord[];
}

const DigitalVehiclePassport: React.FC<DigitalPassportProps> = ({
    vehicle,
    owner,
    serviceHistory,
}) => {
    const { t } = useTranslation();
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    const [showShareModal, setShowShareModal] = useState(false);

    // Generate QR code on mount
    React.useEffect(() => {
        const passportUrl = `${window.location.origin}/passport/${vehicle.id}`;
        QRCode.toDataURL(passportUrl, { width: 200 }).then(setQrCodeUrl);
    }, [vehicle.id]);

    const handleDownloadPDF = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        if (!printWindow) return;

        const totalSpent = serviceHistory.reduce((sum, s) => sum + s.cost, 0);
        const avgMileageBetweenServices =
            serviceHistory.length > 1
                ? (vehicle.mileage - serviceHistory[0].mileage) / (serviceHistory.length - 1)
                : 0;

        printWindow.document.write(`
      <html>
        <head>
          <title>Passeport Véhicule ${vehicle.make} ${vehicle.model}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; padding: 40px; background: #f5f5f5; }
            .passport { background: white; max-width: 900px; margin: 0 auto; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { display: flex; justify-between; align-items: start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6; }
            .logo { font-size: 28px; font-weight: bold; color: #3b82f6; }
            .passport-badge { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 15px 25px; border-radius: 8px; text-align: center; }
            .vehicle-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-block { background: #f9fafb; padding: 15px; border-radius: 6px; }
            .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-size: 18px; font-weight: 600; color: #111827; margin-top: 5px; }
            .section-title { font-size: 20px; font-weight: bold; margin: 30px 0 15px; color: #111827; }
            .timeline { position: relative; padding-left: 30px; }
            .timeline::before { content: ''; position: absolute; left: 8px; top: 0; bottom: 0; width: 2px; background: #e5e7eb; }
            .service-record { position: relative; margin-bottom: 20px; padding: 15px; background: #f9fafb; border-radius: 6px; }
            .service-record::before { content: ''; position: absolute; left: -26px; top: 20px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; border: 3px solid white; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f9fafb; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase; }
            .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 30px 0; }
            .stat-card { background: linear-gradient(135deg, #eff6ff, #dbeafe); padding: 20px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 28px; font-weight: bold; color: #3b82f6; }
            .stat-label { font-size: 14px; color: #6b7280; margin-top: 5px; }
            .qr-section { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 2px dashed #e5e7eb; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
            @media print { body { background: white; } .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="passport">
            <div class="header">
              <div>
                <div class="logo">IBRA Services</div>
                <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Passeport Véhicule Digital</p>
              </div>
              <div class="passport-badge">
                <div style="font-size: 12px; opacity: 0.9;">VIN</div>
                <div style="font-size: 16px; font-weight: bold; margin-top: 5px;">${vehicle.vin}</div>
              </div>
            </div>

            <div class="vehicle-info">
              <div class="info-block">
                <div class="label">Véhicule</div>
                <div class="value">${vehicle.year} ${vehicle.make} ${vehicle.model}</div>
              </div>
              <div class="info-block">
                <div class="label">Plaque</div>
                <div class="value">${vehicle.licensePlate}</div>
              </div>
              <div class="info-block">
                <div class="label">Propriétaire</div>
                <div class="value">${owner.name}</div>
              </div>
              <div class="info-block">
                <div class="label">Kilométrage Actuel</div>
                <div class="value">${vehicle.mileage.toLocaleString()} km</div>
              </div>
            </div>

            <div class="stats">
              <div class="stat-card">
                <div class="stat-value">${serviceHistory.length}</div>
                <div class="stat-label">Services Total</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">$${totalSpent.toLocaleString()}</div>
                <div class="stat-label">Investissement Total</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${Math.round(avgMileageBetweenServices).toLocaleString()}</div>
                <div class="stat-label">km Moy./Service</div>
              </div>
            </div>

            <div class="section-title">📋 Historique Complet d'Entretien</div>
            
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Kilométrage</th>
                  <th>Technicien</th>
                  <th>Coût</th>
                </tr>
              </thead>
              <tbody>
                ${serviceHistory
                .slice()
                .reverse()
                .map(
                    (record) => `
                  <tr>
                    <td>${new Date(record.date).toLocaleDateString()}</td>
                    <td>${record.service}</td>
                    <td>${record.mileage.toLocaleString()} km</td>
                    <td>${record.mechanic}</td>
                    <td style="font-weight: 600; color: #059669;">$${record.cost.toFixed(2)}</td>
                  </tr>
                `
                )
                .join('')}
              </tbody>
            </table>

            <div class="qr-section">
              <p style="color: #6b7280; margin-bottom: 15px;">Accédez à ce passeport en ligne</p>
              ${qrCodeUrl ? `<img src="${qrCodeUrl}" alt="QR Code" style="margin: 0 auto;" />` : ''}
              <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
                Scannez pour voir l'historique à jour
              </p>
            </div>

            <div class="footer">
              <p><strong>IBRA Services</strong> - 2374 Rue Royale, Trois-Rivières, QC</p>
              <p style="margin-top: 5px;">(819) 979-1017 • servicesibra.ca</p>
              <p style="margin-top: 10px; font-style: italic;">
                Document généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}
              </p>
            </div>

            <button onclick="window.print()" class="no-print" style="
              position: fixed; bottom: 30px; right: 30px; 
              background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
              color: white; border: none; padding: 15px 30px; 
              border-radius: 8px; font-size: 16px; font-weight: 600; 
              cursor: pointer; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
            ">
              📄 Imprimer / Sauvegarder PDF
            </button>
          </div>
        </body>
      </html>
    `);
        printWindow.document.close();
    };

    const handleShare = async () => {
        const passportUrl = `${window.location.origin}/passport/${vehicle.id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Passeport ${vehicle.make} ${vehicle.model}`,
                    text: `Historique complet d'entretien pour ${vehicle.year} ${vehicle.make} ${vehicle.model}`,
                    url: passportUrl,
                });
            } catch (error) {
                console.log('Share cancelled');
            }
        } else {
            navigator.clipboard.writeText(passportUrl);
            alert('Lien copié dans le presse-papier!');
        }
    };

    const totalSpent = serviceHistory.reduce((sum, s) => sum + s.cost, 0);

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <FileTextIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Passeport Véhicule Digital</h1>
                                <p className="text-blue-100 text-sm">Historique Complet & Traçabilité</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleDownloadPDF} variant="secondary" icon={<DownloadIcon />}>
                            Télécharger
                        </Button>
                        <Button size="sm" onClick={handleShare} variant="secondary" icon={<ShareIcon />}>
                            Partager
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Vehicle Info + QR */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 p-6">
                    <h3 className="font-bold text-lg mb-4">Informations du Véhicule</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-500">Marque & Modèle</p>
                            <p className="font-bold text-lg">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">VIN</p>
                            <p className="font-mono text-sm">{vehicle.vin}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Plaque</p>
                            <p className="font-bold">{vehicle.licensePlate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Kilométrage</p>
                            <p className="font-bold">{vehicle.mileage.toLocaleString()} km</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Propriétaire</p>
                            <p className="font-bold">{owner.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Services Total</p>
                            <p className="font-bold text-green-600">${totalSpent.toLocaleString()}</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 text-center">
                    <p className="text-sm text-gray-600 mb-4">Accès Rapide</p>
                    {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-3 rounded-lg" />}
                    <p className="text-xs text-gray-500">Scannez pour voir l'historique complet</p>
                </Card>
            </div>

            {/* Service History */}
            <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    Historique d'Entretien
                </h3>
                <div className="space-y-3">
                    {serviceHistory.map((record, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                        >
                            <div>
                                <p className="font-medium">{record.service}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(record.date).toLocaleDateString()} • {record.mileage.toLocaleString()} km • {record.mechanic}
                                </p>
                            </div>
                            <p className="font-bold text-green-600">${record.cost.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default DigitalVehiclePassport;


import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Client, Invoice, InvoiceItem, InvoiceTemplate } from '../types';
import Card from './common/Card';
import Input from './common/Input';
import Select from './common/Select';
import Button from './common/Button';
import { PlusIcon, CloseIcon, FileTextIcon, CheckCircleIcon } from './icons/Icons';
import { generateFullInvoicePdf } from '../utils/pdfGenerator';

interface InvoiceCreatorProps {
  clients: Client[];
  onCancel: () => void;
}

const InvoiceCreator: React.FC<InvoiceCreatorProps> = ({ clients, onCancel }) => {
  const { t } = useTranslation();
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [template, setTemplate] = useState<InvoiceTemplate>('modern');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Entretien automobile', quantity: 1, unitPrice: 85.00 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const getTotal = () => items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleGenerate = () => {
    if (!clientId) {
        alert(t('billing.error_select_client'));
        return;
    }
    const client = clients.find(c => c.id === clientId);
    const invoice: Invoice = {
        id: Date.now().toString(),
        number: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        clientId,
        date,
        dueDate,
        items,
        template,
        status: 'Draft'
    };
    generateFullInvoicePdf(invoice, client, t);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      {/* Configuration Form */}
      <Card className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
            <div>
                <h2 className="text-xl font-bold">{t('billing.create_new_invoice')}</h2>
                <p className="text-xs text-gray-500">Facturation rapide pour Taxi, Mécanique ou Livraison</p>
            </div>
            <Button variant="secondary" size="sm" onClick={onCancel}>{t('common.cancel')}</Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label={t('forms.label_client')} value={clientId} onChange={e => setClientId(e.target.value)}>
                    <option value="">{t('forms.placeholder_select_client')}</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">{t('billing.template')}</label>
                    <div className="flex gap-2">
                        {['modern', 'classic', 'minimal'].map((tmpl) => (
                            <button
                                key={tmpl}
                                onClick={() => setTemplate(tmpl as InvoiceTemplate)}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                                    template === tmpl 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {t(`billing.template_${tmpl}`)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t('forms.label_date')} type="date" value={date} onChange={e => setDate(e.target.value)} />
                <Input label={t('billing.due_date')} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>

            <div>
                <div className="flex justify-between items-end mb-2">
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-300">{t('billing.items')}</label>
                    <span className="text-xs text-gray-500">{items.length} items</span>
                </div>
                <div className="space-y-3 bg-gray-50 dark:bg-gray-800/30 p-4 rounded-xl border border-gray-200 dark:border-gray-700/50">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-2 items-start group">
                            <div className="flex-1">
                                <Input label="" placeholder={t('billing.item_desc')} value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} className="bg-white" />
                            </div>
                            <div className="w-20">
                                <Input label="" type="number" placeholder="Qty" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value))} className="bg-white" />
                            </div>
                            <div className="w-28">
                                <Input label="" type="number" placeholder="Price" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseFloat(e.target.value))} className="bg-white" />
                            </div>
                            <button onClick={() => handleRemoveItem(item.id)} className="mt-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Remove Item"><CloseIcon className="w-4 h-4" /></button>
                        </div>
                    ))}
                    <Button variant="secondary" size="sm" onClick={handleAddItem} icon={<PlusIcon />} className="w-full border-dashed border-2 bg-transparent hover:bg-white dark:hover:bg-gray-800">{t('billing.add_item')}</Button>
                </div>
            </div>
        </div>

        <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">${getTotal().toFixed(2)}</p>
            </div>
            <Button size="lg" onClick={handleGenerate} icon={<FileTextIcon />} className="px-8 shadow-lg shadow-blue-500/30">{t('billing.generate_pdf')}</Button>
        </div>
      </Card>

      {/* Live Preview Side */}
      <div className="w-full lg:w-[400px] hidden lg:flex flex-col">
         <div className="bg-gray-800 text-gray-400 text-xs px-4 py-2 rounded-t-lg flex justify-between">
            <span>Aperçu PDF</span>
            <span>{template.toUpperCase()} MODE</span>
         </div>
         <div className="flex-1 border border-gray-200 dark:border-gray-700 border-t-0 rounded-b-lg shadow-2xl p-6 bg-white text-gray-900 overflow-y-auto">
            {/* Live Preview Render */}
            <div className={`flex flex-col min-h-full ${template === 'modern' ? 'font-sans' : template === 'minimal' ? 'font-mono' : 'font-serif'}`}>
                {template === 'modern' && <div className="h-2 bg-blue-600 w-20 mb-6"></div>}
                
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">IBRA Services</h1>
                        <p className="text-xs text-gray-500 mt-1">2374 Rue Royale, Trois-Rivières</p>
                        <p className="text-xs text-gray-500">(819) 979-1017</p>
                        <p className="text-xs text-blue-500 font-medium">servicesibra.ca</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold text-gray-400">FACTURE</p>
                        <p className="font-bold">#PREVIEW</p>
                    </div>
                </div>

                {clientId ? (
                    <div className="mb-8 p-3 bg-gray-50 rounded border border-gray-100">
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">{t('pdf.invoice.bill_to')}</p>
                        <p className="font-bold text-sm">{clients.find(c => c.id === clientId)?.name}</p>
                        <p className="text-xs text-gray-600">{clients.find(c => c.id === clientId)?.email}</p>
                    </div>
                ) : (
                     <div className="mb-8 p-3 border-2 border-dashed border-gray-200 rounded text-center text-gray-400 text-sm">
                        Sélectionner un client
                     </div>
                )}

                <div className="flex-1">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="text-left py-2 text-gray-500 font-semibold">ITEM</th>
                                <th className="text-center py-2 text-gray-500 font-semibold">QTÉ</th>
                                <th className="text-right py-2 text-gray-500 font-semibold">PRIX</th>
                                <th className="text-right py-2 text-gray-500 font-semibold">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map(i => (
                                <tr key={i.id} className="border-b border-gray-50">
                                    <td className="py-3">{i.description || <span className="text-gray-300 italic">Description...</span>}</td>
                                    <td className="text-center py-3">{i.quantity}</td>
                                    <td className="text-right py-3">${i.unitPrice.toFixed(2)}</td>
                                    <td className="text-right py-3 font-medium">${(i.quantity * i.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-500">TOTAL DÛ</span>
                        <span className={`text-xl font-bold ${template === 'modern' ? 'text-blue-600' : 'text-gray-900'}`}>${getTotal().toFixed(2)}</span>
                     </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default InvoiceCreator;

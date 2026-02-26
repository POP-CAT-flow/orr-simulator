import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export const AccessModal: React.FC<{ onClose: () => void; onSuccess: (rem: boolean) => void }> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', org: '', email: '' });
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => { emailjs.init("YOUR_PUBLIC_KEY"); }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: formData.name, affiliation: formData.org, reply_to: formData.email
      });
      setStatus('success');
      alert("申请已发送至 minyuan@ustc.edu.cn，请留意邮件回复！");
    } catch {
      alert("发送失败，请检查网络 / Failed to send.");
      setStatus('idle');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 p-2 text-2xl">✕</button>

        {/* 左侧：双语申请表单 */}
        <div className="p-10 flex-1 border-r border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">申请访问 <span className="text-sm font-normal text-slate-400 block italic">Request Access</span></h2>
          <form onSubmit={handleApply} className="space-y-4">
            <input required placeholder="姓名 / Name" className="w-full border rounded-xl px-4 py-2 text-sm" onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="单位 / Institution" className="w-full border rounded-xl px-4 py-2 text-sm" onChange={e => setFormData({...formData, org: e.target.value})} />
            <input required type="email" placeholder="邮箱 / Email" className="w-full border rounded-xl px-4 py-2 text-sm" onChange={e => setFormData({...formData, email: e.target.value})} />
            <button type="submit" disabled={status==='sending'} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
              {status === 'sending' ? '发送中...' : '提交申请 / Submit'}
            </button>
          </form>
        </div>

        {/* 右侧：验证码与记住状态 */}
        <div className="p-10 flex-1 bg-slate-50 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">输入访问码 <span className="text-sm font-normal text-slate-400 block italic">Enter Code</span></h2>
          <input type="password" value={code} onChange={e => setCode(e.target.value)} className="w-full border-2 border-slate-200 rounded-2xl px-4 py-4 mb-4 text-center tracking-widest outline-none focus:border-indigo-500 font-bold" placeholder="ACCESS CODE" />
          <div className="flex items-center gap-2 mb-6 justify-center">
            <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} id="rem" />
            <label htmlFor="rem" className="text-xs text-slate-500 cursor-pointer">记住访问码 / Remember me</label>
          </div>
          <button onClick={() => code === "YourSecret2026" ? onSuccess(remember) : alert("访问码错误 / Code Error")} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl">解锁功能 / Unlock</button>
        </div>
      </div>
    </div>
  );
};
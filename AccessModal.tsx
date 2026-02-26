import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

interface ModalProps {
  onClose: () => void;
  onSuccess: (remember: boolean) => void;
}

export const AccessModal: React.FC<ModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', org: '', email: '' });
  const [code, setCode] = useState('');
  const [remember, setRemember] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // 初始化 EmailJS
  useEffect(() => {
    // 这里的 Public Key 需要你在 EmailJS 后台获取
    emailjs.init("YOUR_PUBLIC_KEY");
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      // 这里的 Service ID 和 Template ID 需要你在 EmailJS 后台创建
      await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        from_name: formData.name,
        affiliation: formData.org,
        reply_to: formData.email,
        to_email: "minyuan@ustc.edu.cn"
      });
      alert("申请已发送！作者审核后会通过邮件回复访问码。\nApplication sent! Please check your email later.");
      setIsSending(false);
    } catch (err) {
      alert("发送失败，请检查网络或稍后重试。\nFailed to send, please try again.");
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative border border-white/20 animate-in fade-in zoom-in duration-200">

        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 p-2 text-2xl">✕</button>

        {/* 左侧：申请表单 */}
        <div className="p-10 flex-1 border-r border-slate-100 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">申请访问</h2>
          <h3 className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-widest italic">Request Access</h3>

          <form onSubmit={handleApply} className="space-y-4">
            <input required placeholder="姓名 / Name" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="单位 / Institution" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   onChange={e => setFormData({...formData, org: e.target.value})} />
            <input required type="email" placeholder="邮箱 / Email" className="w-64 border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full"
                   onChange={e => setFormData({...formData, email: e.target.value})} />

            <button type="submit" disabled={isSending} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
              {isSending ? '发送中...' : '提交申请 / Submit Application'}
            </button>
          </form>
        </div>

        {/* 右侧：验证码 */}
        <div className="p-10 flex-1 bg-slate-50 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">已有访问码？</h2>
          <h3 className="text-xs font-semibold text-slate-400 mb-8 text-center uppercase italic">Enter Access Code</h3>

          <input
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-4 mb-4 text-center tracking-[0.5em] outline-none focus:border-indigo-500 font-bold text-lg"
            placeholder="••••••"
          />

          <div className="flex items-center gap-2 mb-6 justify-center">
            <input type="checkbox" id="rem" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-indigo-600" />
            <label htmlFor="rem" className="text-xs text-slate-500 cursor-pointer select-none">记住访问码 / Remember me</label>
          </div>

          <button
            onClick={() => code === "YourSecret2026" ? onSuccess(remember) : alert("访问码错误 / Code Error")}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-xl"
          >
            解锁功能 / Unlock Features
          </button>
        </div>
      </div>
    </div>
  );
};
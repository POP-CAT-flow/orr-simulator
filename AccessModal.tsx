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

  // 【配置区】请确保这些 ID 与 EmailJS 后台完全一致
  const SERVICE_ID = "service_a3b6xyy"; // 👈 已根据您的截图更新
  const TEMPLATE_ID = "template_mpnu5m8"; // 从 Email Templates 页面获取
  const PUBLIC_KEY = "NygbD2F8nQevf0Jq9";  // 从 Account 页面获取
  const MASTER_CODE = "YourSecret2026";  // 您发放给游客的访问码

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, [PUBLIC_KEY]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // 关键：这些 Key 必须在 EmailJS 模板中以 {{from_name}} 等形式存在
    const templateParams = {
      from_name: formData.name,
      affiliation: formData.org,
      reply_to: formData.email,
    };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      alert("申请已发送至作者邮箱！审核后将通过邮件回复访问码。\nApplication sent successfully!");
      setIsSending(false);
    } catch (err: any) {
      console.error("EmailJS Error Detail:", err);
      // 捕获更详细的错误信息，避免只显示 "wo"
      alert(`发送失败: ${err.text || '请检查配置或网络'}`);
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-3xl w-full flex flex-col md:flex-row overflow-hidden relative animate-in fade-in zoom-in duration-200">

        <button onClick={onClose} className="absolute top-6 right-6 text-slate-300 hover:text-slate-600 p-2 text-2xl">✕</button>

        {/* 左侧：双语申请表单 */}
        <div className="p-10 flex-1 border-r border-slate-100 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">申请访问</h2>
          <h3 className="text-xs font-semibold text-slate-400 mb-8 uppercase italic font-mono">Request Access</h3>

          <form onSubmit={handleApply} className="space-y-4">
            <input required placeholder="姓名 / Name" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required placeholder="单位 / Institution" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   onChange={e => setFormData({...formData, org: e.target.value})} />
            <input required type="email" placeholder="邮箱 / Email" className="w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                   onChange={e => setFormData({...formData, email: e.target.value})} />

            <button type="submit" disabled={isSending} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95 disabled:opacity-50">
              {isSending ? '发送中... / Sending...' : '提交申请 / Submit'}
            </button>
          </form>
        </div>

        {/* 右侧：验证码输入 */}
        <div className="p-10 flex-1 bg-slate-50 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">已有访问码？</h2>
          <h3 className="text-xs font-semibold text-slate-400 mb-10 text-center uppercase italic font-mono">Enter Access Code</h3>

          <input
            type="password"
            value={code}
            onChange={e => setCode(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-2xl px-4 py-5 mb-5 text-center tracking-[0.5em] outline-none focus:border-indigo-500 font-bold text-xl bg-white shadow-inner"
            placeholder="••••••"
          />

          <div className="flex items-center gap-2 mb-8 justify-center">
            <input type="checkbox" id="rem" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded accent-indigo-600 cursor-pointer" />
            <label htmlFor="rem" className="text-xs text-slate-500 cursor-pointer select-none">记住访问码 / Remember me</label>
          </div>

          <button
            onClick={() => code === MASTER_CODE ? onSuccess(remember) : alert("访问码错误 / Code Error")}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl"
          >
            解锁功能 / Unlock Features
          </button>
        </div>
      </div>
    </div>
  );
};
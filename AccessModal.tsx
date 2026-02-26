import React, { useState } from 'react';

const AccessModal = ({ onClose, onSuccess }) => {
  const [status, setStatus] = useState('idle'); // idle, sending, success
  const [inputCode, setInputCode] = useState('');

  const handleApply = (e) => {
    e.preventDefault();
    setStatus('sending');

    // 初始化 EmailJS 并发送 (请替换你的 Key)
    // emailjs.send('service_id', 'template_id', {...})
    setTimeout(() => {
        alert("申请已发送至 minyuan@ustc.edu.cn，请等待回复！");
        setStatus('idle');
    }, 1500);
  };

  const handleVerify = () => {
    const MASTER_KEY = "YourCode2026"; // 👈 你审核后告诉别人的码
    if (inputCode === MASTER_KEY) {
      onSuccess();
      onClose();
    } else {
      alert("访问码错误 / Invalid Code");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex overflow-hidden">
        {/* 左：申请 */}
        <div className="p-8 flex-1 border-r border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">申请全权限 (Apply)</h3>
          <p className="text-xs text-slate-500 mb-6 italic">Unlock Microkinetics & DFT Data</p>
          <form onSubmit={handleApply} className="space-y-3">
            <input required placeholder="姓名 / Name" className="w-full border rounded-lg p-2 text-sm" />
            <input required placeholder="单位 / Affiliation" className="w-full border rounded-lg p-2 text-sm" />
            <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-bold">
              {status === 'sending' ? '发送中...' : '发送申请'}
            </button>
          </form>
        </div>
        {/* 右：输入码 */}
        <div className="p-8 flex-1 bg-slate-50 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600">✕</button>
          <h3 className="font-bold text-lg text-slate-800">输入访问码 (Enter)</h3>
          <p className="text-xs text-slate-500 mb-6 italic">Input code from author's email</p>
          <input
            type="password"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Access Code"
            className="w-full border rounded-lg p-2 text-sm mb-4"
          />
          <button onClick={handleVerify} className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-bold">
            验证并解锁
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
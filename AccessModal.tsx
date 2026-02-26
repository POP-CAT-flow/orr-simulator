import React, { useState } from 'react';

export const AccessModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState('');

  const handleApply = () => {
    const subject = encodeURIComponent("ORR Simulator Access Request");
    const body = encodeURIComponent("Hello, I would like to request access to the core kinetic parameters for my research.\n\nName:\nInstitution:\nPurpose:");
    window.location.href = `mailto:minyuan@ustc.edu.cn?subject=${subject}&body=${body}`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-300 hover:text-slate-600 p-2 text-xl">✕</button>
        <div className="p-10 flex-1 border-r border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800">申请访问</h2>
          <h3 className="text-sm font-medium text-slate-400 mb-6 italic uppercase tracking-widest">Request Access</h3>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            微观动力学与位点分布数据包含未发表的科研成果。请通过邮件联系作者获取访问码。<br/>
            <span className="text-xs text-slate-400 italic">Core data is restricted. Please contact the author for a code.</span>
          </p>
          <button onClick={handleApply} className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition shadow-lg">
            生成申请邮件 / Send Application
          </button>
        </div>
        <div className="p-10 flex-1 bg-slate-50 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">输入访问码</h2>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 mb-4 text-center tracking-widest outline-none focus:border-indigo-500"
            placeholder="Access Code"
          />
          <button
            onClick={() => code === "YourSecret2026" ? onSuccess() : alert("Code Error")}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg"
          >
            解锁功能 / Unlock
          </button>
        </div>
      </div>
    </div>
  );
};
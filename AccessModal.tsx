import React, { useState } from 'react';

const AccessModal = ({ onClose, onSuccess }) => {
  const [inputCode, setInputCode] = useState('');

  const MASTER_KEY = "YourCode2026"; // 👈 修改为你设置的码

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex overflow-hidden relative animate-in fade-in zoom-in duration-300">

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition"
        >
          ✕
        </button>

        {/* 左侧：申请信息 */}
        <div className="p-10 flex-1 border-r border-slate-100">
          <h3 className="font-bold text-xl text-slate-800">申请完整权限</h3>
          <p className="text-xs text-slate-400 mb-6 italic uppercase">Request Full Access</p>
          <div className="space-y-4">
             <p className="text-sm text-slate-600 leading-relaxed">
               微观动力学与位点分布数据包含未发表的科研成果，如需解锁实时调节功能，请点击下方生成申请邮件。<br/>
               <span className="text-xs text-slate-400 italic">Core kinetic parameters are restricted. Please apply via email.</span>
             </p>
             <button
               onClick={() => window.location.href="mailto:minyuan@ustc.edu.cn?subject=Access Request"}
               className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition shadow-lg"
             >
               发送申请 / Send Request
             </button>
          </div>
        </div>

        {/* 右侧：输入验证 */}
        <div className="p-10 flex-1 bg-slate-50 flex flex-col justify-center">
          <h3 className="font-bold text-lg text-slate-800 mb-4">输入访问码 / Enter Code</h3>
          <input
            type="password"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none mb-4 text-center tracking-widest"
            placeholder="Access Code"
          />
          <button
            onClick={() => inputCode === MASTER_KEY ? onSuccess() : alert("Code Error")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition shadow-lg"
          >
            解锁功能 / Unlock
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
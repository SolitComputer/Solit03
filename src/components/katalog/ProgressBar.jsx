import React from 'react';

function ProgressBar({ currentStep, totalSteps = 3 }) {
    const getStepStatus = (step) => {
        if (step < currentStep) return 'completed';
        if (step === currentStep) return 'active';
        return '';
    };

    const getStepIcon = (step, status) => {
        if (status === 'completed') return '✓';
        return step;
    };

    const getStepLabel = (step) => {
        switch (step) {
            case 1: return 'Pilih Kategori';
            case 2: return 'Filter Pilihan';
            case 3: return 'Lihat Hasil';
            default: return '';
        }
    };

    const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

    return (
        <div className="progress-container w-full bg-[#e1eeff] rounded-xl my-2.5 mb-5 shadow-inner overflow-hidden">
            <div
                className="progress-bar h-1.5 bg-gradient-to-r from-[#4da6ff] to-[#1e90ff] rounded-xl transition-all duration-500 relative overflow-hidden"
                style={{ width: `${progressPercentage}%` }}
            />
            <div className="progress-steps flex justify-between mt-3">
                {[1, 2, 3].map(step => {
                    const status = getStepStatus(step);
                    return (
                        <div key={step} className={`progress-step flex flex-col items-center gap-1.5 text-xs ${status === 'active' ? 'text-[#1e90ff] font-bold' : 'text-[#4a5568]'}`}>
                            <div className={`step-circle w-[30px] h-[30px] rounded-full bg-[#e1eeff] border-2 border-[#a3c5ff] flex items-center justify-center text-sm font-bold ${status === 'active' ? 'bg-gradient-to-r from-[#4da6ff] to-[#1e90ff] text-white border-transparent' : status === 'completed' ? 'bg-gradient-to-r from-[#4da6ff] to-[#1e90ff] text-white border-transparent' : ''}`}>
                                {getStepIcon(step, status)}
                            </div>
                            <span>{getStepLabel(step)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProgressBar;
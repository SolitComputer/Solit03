import React, { useEffect } from 'react';
import FunnelContainer from '../components/funnel/FunnelContainer';
import { FunnelProvider } from '../context/FunnelContext';

function Katalog() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <FunnelProvider>
      <div className="min-h-screen bg-[#e6f2ff] font-[''Poppins']">
        <FunnelContainer />
      </div>
    </FunnelProvider>
  );
}

export default Katalog;
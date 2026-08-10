import React from 'react';
import GlobalLoadingOverlay from './GlobalLoadingOverlay';

const Loader: React.FC = () => {
    return <GlobalLoadingOverlay forcedLoading={true} />;
};

export default Loader;


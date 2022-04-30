export interface IBackendSwitch {
    backend: 'ethersjs' | 'web3js',
}

export const BackendSwitch: IBackendSwitch = {
    backend: 'ethersjs'
};

export const toggleBackend = (backend: 'ethersjs' | 'web3js') => {
    BackendSwitch.backend = backend;
};

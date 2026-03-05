'use strict';

//TODO: To be removed by version 2.3000.x hard release

// Exposes the legacy Auth Store to the WhatsApp Web client for pre-Comet versions
exports.ExposeLegacyAuthStore = (moduleRaidStr) => {
    eval('window.mR=' + moduleRaidStr);
    
    window.AuthStore = {};
    
    // Find the authentication-related modules using moduleRaid
    const socketModule = window.mR.findModule('Socket')[0];
    if (socketModule && socketModule.Socket) {
        window.AuthStore.AppState = socketModule.Socket;
    }
    
    // Find connection module
    const connModule = window.mR.findModule('Conn')[0];
    if (connModule && connModule.Conn) {
        window.AuthStore.Conn = connModule.Conn;
    }
    
    // Fallback: if AppState is not found, try alternative method
    if (!window.AuthStore.AppState) {
        const waWebSocketModel = window.mR.findModule('WAWebSocketModel');
        if (waWebSocketModel && waWebSocketModel[0] && waWebSocketModel[0].Socket) {
            window.AuthStore.AppState = waWebSocketModel[0].Socket;
        }
    }
};

// src/services/ipfsService.js
import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Connectez-vous à Infura IPFS
const projectId = 'VOTRE_PROJECT_ID_INFURA';
const projectSecret = 'VOTRE_PROJECT_SECRET_INFURA';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    },
});

export const uploadToIPFS = async (file) => {
    try {
        // Vérifier si le fichier existe
        if (!file) throw new Error('Aucun fichier fourni');

        // Créer un buffer du fichier
        const buffer = await file.arrayBuffer();
        
        // Uploader sur IPFS
        const result = await client.add(Buffer.from(buffer));
        
        return result.path;
    } catch (error) {
        console.error('Erreur lors de l\'upload IPFS:', error);
        throw error;
    }
};

export const getIPFSUrl = (hash) => {
    return `https://ipfs.io/ipfs/${hash}`;
};
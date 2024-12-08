import axios from "axios";

// URL de votre serveur IPFS local (RPC d'IPFS)
const IPFS_API_URL = "http://127.0.0.1:5001/api/v0";

export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(`${IPFS_API_URL}/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // IPFS retourne un hash, utilisez ce hash pour générer l'URL
    return `http://127.0.0.1:8080/ipfs/${response.data.Hash}`;
  } catch (error) {
    console.error("Erreur lors du téléchargement sur IPFS :", error);
    throw new Error("Échec de l'upload sur IPFS");
  }
};

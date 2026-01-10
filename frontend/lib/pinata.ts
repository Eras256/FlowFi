
import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_API_SECRET = process.env.NEXT_PUBLIC_PINATA_API_SECRET;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const uploadToPinata = async (file: File): Promise<string> => {
    if (!PINATA_JWT) {
        throw new Error("Pinata JWT not found");
    }

    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
        name: `FlowFi_Invoice_${Date.now()}_${file.name}`,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${(formData as any)._boundary}`,
                Authorization: `Bearer ${PINATA_JWT}`
            }
        });

        return `ipfs://${res.data.IpfsHash}`;
    } catch (error) {
        console.error("Pinata upload failed:", error);
        throw error;
    }
};

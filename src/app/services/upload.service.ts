import { Injectable } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import imageCompression from 'browser-image-compression';

@Injectable({
    providedIn: 'root'
})
export class UploadService {

    constructor(private storage: Storage) { }

    async uploadImagem(file: File, produtoId: string): Promise<string> {

        const compressedFile = await imageCompression(file, {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 800,
            useWebWorker: true
        });

        const caminho = `produtos/${produtoId}/imagem.jpg`;
        const storageRef = ref(this.storage, caminho);

        await uploadBytes(storageRef, compressedFile);

        return await getDownloadURL(storageRef);
    }
}
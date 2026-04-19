/**
 * File Validation Utility
 * Validates file uploads with type, size, and magic byte checking
 */

export interface FileValidationOptions {
    allowedTypes: string[];
    maxSize: number; // in bytes
    checkMagicBytes?: boolean;
}

export class FileValidator {
    private static readonly MAGIC_BYTES: Record<string, string> = {
        '89504e47': 'image/png',
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        'ffd8ffe2': 'image/jpeg',
        '25504446': 'application/pdf',
        '504b0304': 'application/zip',
        '504b0506': 'application/zip',
        '504b0708': 'application/zip'
    };

    /**
     * Validate a file upload
     * @param file - File to validate
     * @param options - Validation options
     * @throws ValidationError if file is invalid
     */
    static async validate(file: File, options: FileValidationOptions): Promise<void> {
        // Check file type
        if (!options.allowedTypes.includes(file.type)) {
            throw new Error(
                `Invalid file type. Allowed types: ${options.allowedTypes.join(', ')}`
            );
        }

        // Check file size
        if (file.size > options.maxSize) {
            const maxSizeMB = (options.maxSize / (1024 * 1024)).toFixed(2);
            throw new Error(`File too large. Maximum size: ${maxSizeMB}MB`);
        }

        // Check magic bytes if enabled
        if (options.checkMagicBytes) {
            await this.validateMagicBytes(file);
        }
    }

    /**
     * Validate file signature (magic bytes)
     * @param file - File to validate
     * @throws Error if magic bytes don't match declared type
     */
    private static async validateMagicBytes(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const arr = new Uint8Array(e.target?.result as ArrayBuffer).subarray(0, 4);
                    const header = Array.from(arr)
                        .map(b => b.toString(16).padStart(2, '0'))
                        .join('');

                    const detectedType = this.MAGIC_BYTES[header];

                    if (!detectedType) {
                        reject(new Error('Unknown file type. File signature not recognized.'));
                        return;
                    }

                    // Check if detected type matches declared type
                    if (detectedType !== file.type) {
                        reject(
                            new Error(
                                `File signature mismatch. File claims to be ${file.type} but appears to be ${detectedType}. Possible file spoofing.`
                            )
                        );
                        return;
                    }

                    resolve();
                } catch (error) {
                    reject(new Error('Failed to read file signature'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsArrayBuffer(file.slice(0, 4));
        });
    }

    /**
     * Get human-readable file size
     * @param bytes - Size in bytes
     * @returns Formatted string (e.g., "2.5 MB")
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }
}

/**
 * Common file validation presets
 */
export const FILE_VALIDATION_PRESETS = {
    IMAGE: {
        allowedTypes: ['image/png', 'image/jpeg', 'image/jpg'],
        maxSize: 5 * 1024 * 1024, // 5MB
        checkMagicBytes: true
    },
    DOCUMENT: {
        allowedTypes: ['application/pdf'],
        maxSize: 10 * 1024 * 1024, // 10MB
        checkMagicBytes: true
    },
    PROJECT_SUBMISSION: {
        allowedTypes: ['image/png', 'image/jpeg', 'application/pdf'],
        maxSize: 5 * 1024 * 1024, // 5MB
        checkMagicBytes: true
    }
} as const;

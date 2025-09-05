export declare function hashPassword(password: string): Promise<string>;
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
export declare const validatePassword: (password: string) => {
    isValid: boolean;
    message?: string;
};
//# sourceMappingURL=authUtils.d.ts.map
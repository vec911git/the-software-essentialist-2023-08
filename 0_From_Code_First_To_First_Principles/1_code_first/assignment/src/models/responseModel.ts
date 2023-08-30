export class APIResponse {
    error: string | undefined;
    data: string | undefined;
    success: boolean | undefined;

    public constructor(init?:Partial<APIResponse>) {
        Object.assign(this, init);
    }
}
export class APIResponse {
    error: any | undefined;
    data: any | undefined;
    success: boolean | undefined;

    public constructor(init?:Partial<APIResponse>) {
        Object.assign(this, init);
    }
}
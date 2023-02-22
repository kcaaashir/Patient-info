import * as dotenv from 'dotenv';

export class ConfigService {
    private readonly envConfig: Record<string, string>

    constructor(){
        const result = dotenv.config();
        this.envConfig = result.error ? process.env : result.parsed;
    }

    public get( key: string ): string {
        return this.envConfig[key];
    }

    public async getMongoConfig() {
        return {
            uri: this.get('DATABASE_URL'),
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
        }
    }

    public async getCloudinaryConfig() {
        return{
            cloud_name: this.get('CLOUDINARY_NAME'),
            api_key: this.get('CLOUDINARY_KEY'),
            api_secret: this.get('CLOUDINARY_SECRET')
        }
    }
}
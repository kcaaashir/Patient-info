import { v2 } from 'cloudinary';
import { ConfigService } from 'src/config/config.service';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: async (configService: ConfigService) => {
    return v2.config(configService.getCloudinaryConfig());
  },
};

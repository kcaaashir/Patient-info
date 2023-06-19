import { v2 } from 'cloudinary';
import { ConfigService } from 'src/config/config.service';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: async (configService: ConfigService) => {
    return v2.config({
      cloud_name: 'dea1lzwrv',
      api_key: '318927376412612',
      api_secret: 'V_DGRCjgjcVThuO302KxCmNgHfk',
    });
  },
};

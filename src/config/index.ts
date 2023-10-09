/* eslint-disable no-undef */
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bycrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),
  profile_pic_dest: process.env.PROFILE_PIC_DEST,
  blog_banner_dest: process.env.BLOG_BANNER_DEST,
  server_host: process.env.SERVER_HOST,
  jwt: {
    secret: process.env.JWT_SECRET,
    expires_in: process.env.JWT_EXPIRES_IN,
    refresh_secret: process.env.JWT_REFRESH_SECRET,
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  },
  mail: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.REDIRECT_URI,
    refresh_token: process.env.REFRESH_TOKEN,
    mail_sender: process.env.MAIL_SENDER,
  },
  admin_secret_key: process.env.ADMIN_SECRET_KEY,
  main_admin_email: process.env.MAIN_ADMIN_EMAIL,
};

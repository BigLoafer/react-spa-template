const baseName = process.env.APP_ENV != "local" ? process.env.BASE_NAME : "";

export { baseName };

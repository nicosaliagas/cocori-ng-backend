import { Router } from 'express';

import UploaderApis from './routes/uploader-apis';

// guaranteed to get dependencies
export default () => {
	const app = Router();

	UploaderApis(app);

	return app
}
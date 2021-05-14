import { Router } from 'express';

import LotoApis from './routes/loto-apis';
import UploaderApis from './routes/uploader-apis';

// guaranteed to get dependencies
export default () => {
	const app = Router();

	UploaderApis(app);

	LotoApis(app);

	return app
}
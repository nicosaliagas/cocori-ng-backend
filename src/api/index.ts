import { Router } from 'express';

import BoulleBoApis from './routes/boulle-bo-apis';
import LotoApis from './routes/loto-apis';
import UploaderApis from './routes/uploader-apis';

// guaranteed to get dependencies
export default () => {
	const app = Router();

	BoulleBoApis(app);

	UploaderApis(app);

	LotoApis(app);

	return app
}
import { mocked } from 'ts-jest/utils';
import isAdmin, { YouAreNotAdministrator } from '../../../server/middlewares/isAdmin';
import { Socket } from '../../../types/socket';
import { getMiddlewareParams } from '../../helpers/middleware';
import config from '../../../config/server';

jest.mock('../../../config/server');

describe('server/middlewares/isAdmin', () => {
    it('should call service fail when user not administrator', async () => {
        const socket = {
            id: 'id',
            user: 'user',
        } as Socket;
        const middleware = isAdmin(socket);

        const { args, cb, next } = getMiddlewareParams('sealUser');

        await middleware(args, next);
        expect(cb).toBeCalledWith(YouAreNotAdministrator);
    });

    it('should call service success when user is administrator', async () => {
        mocked(config).administrator = ['administrator'];
        const socket = {
            id: 'id',
            user: 'administrator',
        } as Socket;
        const middleware = isAdmin(socket);

        const { args, next } = getMiddlewareParams('sealUser');

        await middleware(args, next);
        expect(next).toBeCalled();
    });
});

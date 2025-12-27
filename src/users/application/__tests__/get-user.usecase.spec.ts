import { TestBed, type Mocked } from '@suites/unit';
import { GetUserUsecase } from '../get-user.usecase';
import type { UserRepository } from 'src/users/domain/user.interface';

describe('GetUserUseCase', () => {
    let getUserUsecase: GetUserUsecase;
    let userRepository: Mocked<UserRepository>;
    
    beforeAll(async () => {
        const mockRepo = {
            findById: jest.fn(),
        };

        const { unit } = await TestBed.solitary(GetUserUsecase)
            .mock('USER_REPOSITORY')
            .final(mockRepo)
            .compile();
        
        getUserUsecase = unit;
        userRepository = mockRepo as Mocked<UserRepository>;
    });

    it('should get a user by id', async () => {
        const user = { 
            id: 1, 
            name: 'John Doe', 
            username: 'johndoe', 
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        userRepository.findById.mockResolvedValue(user);

        const result = await getUserUsecase.getUserById(1);

        expect(userRepository.findById).toHaveBeenCalledWith(1);
        expect(result).toEqual(user);
    });
})
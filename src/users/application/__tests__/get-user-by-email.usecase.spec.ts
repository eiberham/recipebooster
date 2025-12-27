import { TestBed, type Mocked } from '@suites/unit';
import { GetUserByEmailUsecase } from '../get-user-by-email.usecase';
import type { UserRepository } from 'src/users/domain/user.interface';


describe('GetUserByEmailUseCase', () => {
    let getUserByEmailUsecase: GetUserByEmailUsecase;
    let userRepository: Mocked<UserRepository>;
    
    beforeAll(async () => {
        const mockRepo = {
            findByEmail: jest.fn(),
        };

        const { unit } = await TestBed.solitary(GetUserByEmailUsecase)
            .mock('USER_REPOSITORY')
            .final(mockRepo)
            .compile();
        
        getUserByEmailUsecase = unit;
        userRepository = mockRepo as Mocked<UserRepository>;
    });

    it('should get a user by email', async () => {
        const user = { 
            id: 1, 
            name: 'John Doe', 
            username: 'johndoe', 
            email: 'john.doe@example.com',
            password: 'hashedpassword',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        userRepository.findByEmail.mockResolvedValue(user);

        const result = await getUserByEmailUsecase.getUserByEmail(user.email);

        expect(userRepository.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
        expect(result).toEqual(user);
    });
})
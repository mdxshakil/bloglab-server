import { z } from 'zod';
import { userRole } from '../../../constants';

const login = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});

const MAX_FILE_SIZE = 200000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

const signup = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required',
    }),
    password: z.string({
      required_error: 'Email is required',
    }),
    role: z.enum([...userRole] as [string, ...string[]], {
      required_error: 'Role is required',
    }),
    firstName: z.string({
      required_error: 'First name is required',
    }),
    lastName: z.string({
      required_error: 'Last name is required',
    }),
    profilePicture: z
      .any()
      .refine(files => files?.length == 1, 'Image is required.')
      .refine(
        files => files?.[0]?.size <= MAX_FILE_SIZE,
        `Max file size is 2MB.`
      )
      .refine(
        files => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
        '.jpg, .jpeg, .png files are accepted.'
      ),
    contactNo: z.string({
      required_error: 'Contact no. is required',
    }),
    favouriteCategories: z.array(
      z.string({
        required_error: 'Atleast 2 category must be selected',
      })
    ),
  }),
});

export const AuthValidation = {
  login,
  signup,
};

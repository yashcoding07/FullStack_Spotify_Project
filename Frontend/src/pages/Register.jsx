import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const Register = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      fullName: {
        firstName: '',
        lastName: '',
      },
      password: '',
      role: 'user',
    },
  })

  const onSubmit = async (data) => {
    // Ensures role defaults to 'user' if omitted
    const payload = {
      ...data,
      role: data.role || 'user',
    }

    try {
    const response  = await axios.post("http://localhost:3000/api/auth/register", {
      email: data.email,
      fullName: {
        firstName: data.fullName.firstName,
        lastName: data.fullName.lastName
      },
      password: data.password,
      role: data.role || 'user', 
    }, {
      withCredentials: true
    });

    console.log("Register response: ", response.data);

    if (payload.role === 'artist') {
      navigate("/artist/dashboard");
    } else {
      navigate("/");
    }  

    } catch (error) {
     console.log("Error registering: ", error); 
    }

    console.log('Register payload:', payload)
  }

  const handleGoogleAuth = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3000/api/auth/google'
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Header / Brand */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 text-2xl sm:text-3xl font-extrabold tracking-tight hover:opacity-90 transition-opacity">
          <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1DB954] flex items-center justify-center text-black font-black text-xl">
            ♫
          </span>
          <span>Spotify</span>
        </Link>
      </div>

      {/* Register Card */}
      <div className="w-full max-w-md bg-[#181818] p-6 sm:p-8 rounded-2xl shadow-2xl border border-neutral-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          Sign up to start listening
        </h1>
        <p className="text-sm text-neutral-400 text-center mb-6">
          Create your account in seconds
        </p>

        {/* Google Signup Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-500 font-semibold text-sm transition-all duration-200"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#181818] px-3 text-neutral-500 font-medium">or</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-semibold mb-1 text-neutral-200">
              Email address
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@domain.com"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address',
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                errors.email
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-700 focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Full Name: First Name & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="block text-xs sm:text-sm font-semibold mb-1 text-neutral-200">
                First name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="John"
                {...register('fullName.firstName', {
                  required: 'First name is required',
                })}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                  errors.fullName?.firstName
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-neutral-700 focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]'
                }`}
              />
              {errors.fullName?.firstName && (
                <p className="text-red-400 text-xs mt-1.5">{errors.fullName.firstName.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-xs sm:text-sm font-semibold mb-1 text-neutral-200">
                Last name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register('fullName.lastName', {
                  required: 'Last name is required',
                })}
                className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                  errors.fullName?.lastName
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-neutral-700 focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]'
                }`}
              />
              {errors.fullName?.lastName && (
                <p className="text-red-400 text-xs mt-1.5">{errors.fullName.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-semibold mb-1 text-neutral-200">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="At least 6 characters"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border text-white placeholder-neutral-500 text-sm focus:outline-none transition-colors ${
                errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-700 focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]'
              }`}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Role (Optional: 'user' or 'artist') */}
          <div>
            <label htmlFor="role" className="block text-xs sm:text-sm font-semibold mb-1 text-neutral-200">
              Role <span className="text-neutral-500 font-normal">(Optional)</span>
            </label>
            <select
              id="role"
              {...register('role')}
              className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954] transition-colors"
            >
              <option value="user">User (Listener)</option>
              <option value="artist">Artist (Creator)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-full bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-60 active:scale-[0.99] text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-md"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-neutral-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-[#1DB954] font-semibold underline underline-offset-4 transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register

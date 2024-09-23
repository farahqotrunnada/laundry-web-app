export default function AboutUs() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-8 rounded-lg'>
      <div className='container mx-auto text-center'>
        <h1 className='text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100'>About Us</h1>
        <p className='text-base sm:text-lg leading-relaxed mb-6 sm:mb-12 max-w-lg sm:max-w-3xl mx-auto text-left sm:text-center'>
          Welcome to{' '}
          <span className='font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-teal-400 to-blue-500'>
            LaundryXpert
          </span>
          , your go-to platform for all your laundry needs. We provide fast, reliable, and eco-friendly laundry services
          to make your life easier.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center'>
          {/* Affordable Pricing */}
          <div className='flex flex-col items-center p-6 shadow-lg rounded-3xl bg-white dark:bg-gray-800'>
            <div className='mb-4 text-orange-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 sm:h-12 sm:w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 8v4m0 4h.01M20.172 12.172A4 4 0 1117.243 9.9L12 5.828l-5.243 4.071a4 4 0 11-2.93-2.93L12 2l8.172 6.243z'
                />
              </svg>
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2'>Affordable Pricing</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
              We offer competitive prices while maintaining high-quality laundry services.
            </p>
          </div>

          {/* Advanced Technology */}
          <div className='flex flex-col items-center p-6 shadow-lg rounded-3xl bg-white dark:bg-gray-800'>
            <div className='mb-4 text-orange-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 sm:h-12 sm:w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M11 12h10M3 12h4m-2 0a7 7 0 1114 0 7 7 0 01-14 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2'>Advanced Technology</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
              We use modern machines and eco-friendly detergents to ensure your clothes stay fresh and clean.
            </p>
          </div>

          {/* Pickup and Delivery */}
          <div className='flex flex-col items-center p-6 shadow-lg rounded-3xl bg-white dark:bg-gray-800'>
            <div className='mb-4 text-orange-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 sm:h-12 sm:w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 4h16v16H4z' />
              </svg>
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2'>Pickup and Delivery</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
              Enjoy hassle-free laundry services with our convenient pickup and delivery options.
            </p>
          </div>

          {/* Real-time Tracking */}
          <div className='flex flex-col items-center p-6 shadow-lg rounded-3xl bg-white dark:bg-gray-800'>
            <div className='mb-4 text-orange-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 sm:h-12 sm:w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 10h2a2 2 0 012 2v6h10v-6a2 2 0 012-2h2m-9-6h6a2 2 0 012 2v6H7V6a2 2 0 012-2h6'
                />
              </svg>
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2'>Real-time Tracking</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
              Track your orders in real-time and stay updated on the status of your laundry.
            </p>
          </div>

          {/* Secure Payments */}
          <div className='flex flex-col items-center p-6 shadow-lg rounded-3xl bg-white dark:bg-gray-800'>
            <div className='mb-4 text-orange-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 sm:h-12 sm:w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 7h14M5 7V5a2 2 0 012-2h10a2 2 0 012 2v2m0 0h-4m-8 0v2a1 1 0 01-1 1h-1a1 1 0 01-1-1V7h4z'
                />
              </svg>
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2'>Secure Payments</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
              We offer secure online payment options to ensure a smooth and safe transaction.
            </p>
          </div>

          {/* Satisfaction Guaranteed */}
          <div className='flex flex-col items-center p-6 shadow-lg rounded-3xl bg-white dark:bg-gray-800'>
            <div className='mb-4 text-orange-500'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-10 w-10 sm:h-12 sm:w-12'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 12H4' />
              </svg>
            </div>
            <h3 className='text-lg sm:text-xl font-bold mb-2'>Satisfaction Guaranteed</h3>
            <p className='text-gray-600 dark:text-gray-300 text-sm sm:text-base'>
              Your satisfaction is our priority. We ensure top-quality services every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

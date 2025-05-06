export default function LottieAnimation() {
    return (
      <div className="flex justify-center mt-20">
        <lottie-player
          src="https://assets5.lottiefiles.com/packages/lf20_9cyyl8i4.json"
          background="transparent"
          speed="1"
          style={{ width: '300px', height: '300px' }}
          loop
          autoplay
        ></lottie-player>
      </div>
    )
  }
// /src/main.ts

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------------------------------------
  // --- Existing Carousel Logic: Updates indicators based on scroll ---
  // -----------------------------------------------------------------
  const slides = document.querySelectorAll('.carousel-item');
  const indicators = document.querySelectorAll('.slide-indicator');
  const activeClass = 'active-style'; // Use the class name defined in your CSS

  const carouselObserverOptions = {
    root: document.querySelector('.carousel'),
    threshold: 0.8,
  };

  const carouselObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const slideId = entry.target.id;
      const indicator = document.querySelector(
        `.slide-indicator[data-slide="${slideId}"]`,
      );

      if (!indicator) return;

      if (entry.isIntersecting) {
        // Remove active class from all indicators
        indicators.forEach((btn) => btn.classList.remove(activeClass));

        // Add active class to the currently visible slide's indicator
        indicator.classList.add(activeClass);
      }
    });
  }, carouselObserverOptions);

  // Attach the carousel observer to all carousel slides
  slides.forEach((slide) => {
    if (slide.id.startsWith('slide')) {
      carouselObserver.observe(slide);
    }
  });

  // -----------------------------------------------------------------
  // --- NEW Animation Logic for Staggered Pop-in (One-Time Trigger) ---
  // -----------------------------------------------------------------

  // 1. Target the elements
  const animatedMockup = document.querySelector<HTMLElement>(
    '#mockup-animation-container',
  );
  const defaultCarousel =
    document.querySelector<HTMLElement>('#default-carousel');
  const featuresSection = document.querySelector<HTMLElement>('#features');
  const featuresLink = document.querySelector<HTMLAnchorElement>(
    'a[href="#features"]',
  );

  // Classes for Mockup final state (Slide-in)
  const mockupActiveClasses = ['opacity-100', 'translate-x-0'];

  // Classes for Carousel final state (Pop-in)
  const carouselActiveClasses = ['opacity-100', 'scale-100'];

  let isMockupAnimated = false; // Flag to ensure the animation only runs once

  // Function to apply the animation classes and set the flag
  const runMockupAnimation = () => {
    if (!isMockupAnimated) {
      isMockupAnimated = true;

      // 1. START CAROUSEL ANIMATION IMMEDIATELY (Pop-in)
      if (defaultCarousel) {
        defaultCarousel.classList.add(...carouselActiveClasses);
      }

      // 2. STAGGERED DELAY: Start the Mockup slide-in after 500ms
      if (animatedMockup) {
        // We use 500ms delay for the mockup to slide in after the carousel starts.
        setTimeout(() => {
          animatedMockup.classList.add(...mockupActiveClasses);
        }, 500); // <-- Adjust this value (in milliseconds) for more or less delay
      }
    }
  };

  // --- A. Intersection Observer (Handles First Scroll-in) ---

  if (animatedMockup && featuresSection) {
    const animationObserverOptions = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.2, // Trigger when 20% of the features section is visible
    };

    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Trigger animation only if intersecting AND it hasn't run yet
        // Note: The flag check inside runMockupAnimation handles the multi-element case now.
        if (entry.isIntersecting) {
          runMockupAnimation();

          // Stop observing after the animation has been triggered
          animationObserver.unobserve(featuresSection);
        }
      });
    }, animationObserverOptions);

    // Start observing the features section
    animationObserver.observe(featuresSection);
  }

  // --- B. Click Handler (Handles Navigation Click) ---

  if (featuresLink) {
    featuresLink.addEventListener('click', () => {
      // Run the animation immediately when the link is clicked
      runMockupAnimation();
    });
  }
});

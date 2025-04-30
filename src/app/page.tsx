"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { id: 1, image: "/img/1.jpg" },
    { id: 2, image: "/img/2.jpg" },
    { id: 3, image: "/img/3.jpg" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <>
      {/* Hero Section with Carousel */}
      <section className="hero">
        <div className="carousel-container">
          <div className="carousel">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              ></div>
            ))}
          </div>
          <div className="carousel-controls">
            <button className="carousel-prev" onClick={prevSlide} aria-label="Previous slide">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button className="carousel-next" onClick={nextSlide} aria-label="Next slide">
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
        <div className="hero-content">
          <h1>Welcome to Love View Estate</h1>
          <p>Your premier real estate partner for exceptional properties</p>
          <div className="hero-buttons">
            <Link href="/for-sale-north-ayrshire" className="btn btn-primary">
              Explore Properties
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="welcome-section">
        <div className="welcome-container">
          <h2 className="welcome-heading">WELCOME TO LOVE VIEW ESTATE LETTING & SALES</h2>
          <h3 className="welcome-subheading">AWARD WINNING SPECIALISTS IN BOTH ESTATE AGENCY & LETTINGS.</h3>
          <p className="welcome-text">
            At Love View Estate we take pride in the service that we provide to our clients, always working with our
            clients best interest & with integrity. Our friendly, experienced team are on hand 7 days a week to assist
            you every step of the way. With 2 Branches in strategic locations in North Ayrshire (Saltcoats) & East
            Ayrshire (Kilmarnock) we have Ayrshire covered.
          </p>
        </div>
      </section>

      {/* Valuations Section */}
      <section className="valuations-section">
        <div className="valuations-container">
          <div className="valuations-image">
            <Image
              src="/img/2.jpg"
              alt="Interior of a modern property"
              width={600}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <div className="valuations-content">
            <h2 className="valuations-heading">Valuations for Selling or Renting</h2>
            <p className="valuations-text">
              At Love View Estate we offer free valuations whether you are looking to Sell or Rent out your property.
              Our team are on hand to provide knowledgable advice on the Ayrshire property market.
            </p>
            <p className="valuations-cta">
              If you have a property in Ayrshire Contact us to arrange your free no obligation property valuation
            </p>
            <Link href="/valuation" className="btn btn-dark">
              Request Valuation
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="services-overlay"></div>
        <div className="services-container">
          <div className="services-grid">
            <Link href="/for-sale-north-ayrshire" className="service-card">
              <div
                className="service-image"
                style={{
                  backgroundImage: "url('/img/1.jpg')",
                }}
              >
                <div className="service-overlay"></div>
                <h3 className="service-title">FOR SALE</h3>
                <div className="service-arrow">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            <Link href="/for-rent" className="service-card">
              <div
                className="service-image"
                style={{
                  backgroundImage: "url('/img/2.jpg')",
                }}
              >
                <div className="service-overlay"></div>
                <h3 className="service-title">TO LET</h3>
                <div className="service-arrow">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            <Link href="/rental-guide" className="service-card">
              <div
                className="service-image"
                style={{
                  backgroundImage: "url('/img/3.jpg')",
                }}
              >
                <div className="service-overlay"></div>
                <h3 className="service-title">RENTING</h3>
                <div className="service-arrow">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>

            <Link href="/selling" className="service-card">
              <div
                className="service-image"
                style={{
                  backgroundImage: "url('/img/4.jpg')",
                }}
              >
                <div className="service-overlay"></div>
                <h3 className="service-title">SELLING</h3>
                <div className="service-arrow">
                  <ArrowRight className="h-5 w-5" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

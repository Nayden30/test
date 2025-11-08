import React, { useState, useMemo, useEffect } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';

interface PresentationModeProps {
  content: string;
  title: string;
  author: string;
  onClose: () => void;
}

const parseMarkdownForSlides = (markdown: string): React.ReactNode[][] => {
  const slides: React.ReactNode[][] = [];
  if (!markdown) return slides;

  const lines = markdown.split('\n');
  let currentSlide: React.ReactNode[] = [];
  let currentListItems: string[] = [];

  const parseInline = (lineText: string): React.ReactNode => {
    const parts = lineText.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
    });
  };

  const flushList = () => {
    if (currentListItems.length > 0) {
      currentSlide.push(
        <ul key={`ul-${slides.length}-${currentSlide.length}`} className="list-disc pl-8 space-y-2 mt-4 text-2xl">
          {currentListItems.map((item, idx) => (
            <li key={idx}>{parseInline(item)}</li>
          ))}
        </ul>
      );
      currentListItems = [];
    }
  };

  lines.forEach((line, index) => {
    const isHeading = line.startsWith('# ');
    const isSubHeading = line.startsWith('## ');

    if (isHeading || isSubHeading) {
      flushList();
      if (currentSlide.length > 0) {
        slides.push(currentSlide);
      }
      currentSlide = [];
    }

    if (isHeading) {
      currentSlide.push(<h1 key={index} className="text-5xl font-bold mb-6">{line.substring(2)}</h1>);
    } else if (isSubHeading) {
      currentSlide.push(<h2 key={index} className="text-4xl font-semibold mb-4 text-blue-300">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
       flushList();
       currentSlide.push(<h3 key={index} className="text-3xl font-medium mt-6 mb-2">{line.substring(4)}</h3>);
    } else if (line.startsWith('* ')) {
      currentListItems.push(line.substring(2));
    } else if (line.trim() !== '') {
      flushList();
      currentSlide.push(<p key={index} className="my-4 text-2xl leading-relaxed">{parseInline(line)}</p>);
    } else {
        flushList();
    }
  });

  flushList();
  if (currentSlide.length > 0) {
    slides.push(currentSlide);
  }

  return slides;
};

const PresentationMode: React.FC<PresentationModeProps> = ({ content, title, author, onClose }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const slides = useMemo(() => {
    const titleSlide = [
      <h1 key="title" className="text-6xl font-extrabold">{title}</h1>,
      <p key="author" className="mt-4 text-3xl text-gray-400">by {author}</p>
    ];
    const contentSlides = parseMarkdownForSlides(content);
    return [titleSlide, ...contentSlides];
  }, [content, title, author]);

  const totalSlides = slides.length;

  const goToNextSlide = () => {
    setCurrentSlideIndex(prev => Math.min(prev + 1, totalSlides - 1));
  };

  const goToPrevSlide = () => {
    setCurrentSlideIndex(prev => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNextSlide();
      if (e.key === 'ArrowLeft') goToPrevSlide();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSlide, goToPrevSlide, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 text-white z-[100] flex flex-col p-8 font-serif">
      <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-white transition">
        <XMarkIcon className="h-10 w-10" />
      </button>

      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-5xl text-center">
          {slides[currentSlideIndex]}
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-between">
        <div className="text-gray-400">
          Slide {currentSlideIndex + 1} of {totalSlides}
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={goToPrevSlide} disabled={currentSlideIndex === 0} className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Prev
          </button>
          <button onClick={goToNextSlide} disabled={currentSlideIndex === totalSlides - 1} className="px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentationMode;

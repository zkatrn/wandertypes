"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import balloonImage from "@/lib/assets/balloon.png";
import { Sparkles, Coffee, Palmtree, Users, Compass, Route, DollarSign, MessageSquareText } from "lucide-react";
import styles from "@/styles/ProgressBar.module.scss";

type ProgressBarProps = {
  current: number;
  total: number;
  maxStepReached?: number;
  onStepClick?: (step: number) => void;
  isFinalAnimation?: boolean;
};

const stepIcons = [
  Sparkles,           // Step 1: Trip Mood
  Coffee,             // Step 2: Travel Pace
  Palmtree,           // Step 3: Environment
  Users,              // Step 4: Group Reality
  Compass,            // Step 5: Activities
  Route,              // Step 6: Trip Friction Tolerance
  DollarSign,         // Step 7: Budget Feel
  MessageSquareText,  // Step 8: Open Text
];

export function ProgressBar({ current, total, maxStepReached, onStepClick, isFinalAnimation }: ProgressBarProps) {
  const maxReached = maxStepReached || current;
  const progressPercentage = (maxReached / total) * 100;
  // Keep balloon visible on final step by capping at 95%
  const balloonPercentage = Math.min((current / total) * 100, 95);
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const prevCurrentRef = useRef(current);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Determine direction
    if (current > prevCurrentRef.current) {
      setDirection('forward');
    } else if (current < prevCurrentRef.current) {
      setDirection('backward');
    }
    
    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // MessageSquareTextt moving
    setIsMoving(true);
    
    // Stop rotation after horizontal movement completes
    timerRef.current = setTimeout(() => {
      setIsMoving(false);
    }, 800);
    
    prevCurrentRef.current = current;
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [current]);

  return (
    <div className={styles.container}>
      {/* <div className={styles.info}>
        <span>Question {current} of {total}</span>
        <span>{Math.round(progressPercentage)}%</span>
      </div> */}
      
      <div className={styles.progressWrapper}>
        {/* Background track */}
        <div className={styles.track} />
        
        {/* Full gradient background - shows max progress reached */}
        <div
          className={styles.gradient}
          style={{
            clipPath: `inset(0 ${100 - progressPercentage}% 0 0 round 9999px)`,
          }}
        />
        
        {/* Step markers */}
        {Array.from({ length: total }, (_, idx) => {
          const stepNumber = idx + 1;
          const stepPercentage = (stepNumber / total) * 100;
          const Icon = stepIcons[idx];
          const isDone = idx < maxReached - 1;
          const isActive = idx === current - 1;
          const isClickable = stepNumber <= maxReached;
          
          return (
            <div
              key={idx}
              className={`${styles.stepMarker} ${
                isDone 
                  ? styles.done
                  : isActive
                  ? styles.active
                  : styles.upcoming
              } ${isClickable ? styles.clickable : ''}`}
              style={{ 
                left: `${stepPercentage}%`,
                cursor: isClickable ? 'pointer' : 'default',
              }}
              onClick={() => isClickable && onStepClick?.(stepNumber)}
            >
              <Icon className="w-4 h-4" />
            </div>
          );
        })}
        
        {/* Balloon floating on top - follows current position */}
        <div
          className={`${styles.balloon} ${isFinalAnimation ? styles.flyToUser : ''}`}
          style={!isFinalAnimation ? { 
            left: `${balloonPercentage}%`, 
            top: '-30px',
            transform: `translate(-50%, 0) rotate(${
              isMoving 
                ? direction === 'forward' ? '45deg' : '-45deg'
                : '0deg'
            })`,
            transition: isMoving 
              ? 'left 0.75s cubic-bezier(0.34, 1.2, 0.64, 1), transform 0.2s ease-out'
              : 'left 0.75s cubic-bezier(0.34, 1.2, 0.64, 1), transform 1.5s ease-in-out',
          } : undefined}
        >
          <div className={styles.balloonImage}>
            <Image 
              src={balloonImage} 
              alt="Progress" 
              width={40} 
              height={40}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

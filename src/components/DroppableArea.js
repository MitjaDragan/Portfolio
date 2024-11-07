// src/components/DroppableArea.js
import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DraggableImage from './DraggableImage';
import LevelSelector from './LevelSelector';
import { ImageLoader } from './ImageLoader';
import './DroppableArea.css';

const BASE_SCREEN_WIDTH = 11520;
const BASE_LOCK_THRESHOLD = 100;

const calculateScaleFactor = () => {
    return window.innerWidth / BASE_SCREEN_WIDTH;
};

const getRandomPosition = () => {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const SCREEN_HEIGHT = screenHeight * (BASE_SCREEN_WIDTH / screenWidth);

    const x = Math.floor(0.01 * BASE_SCREEN_WIDTH + Math.random() * 0.89 * BASE_SCREEN_WIDTH);
    const y = Math.floor(0.2 * SCREEN_HEIGHT + Math.random() * 0.5 * SCREEN_HEIGHT);
    return { x, y };
};

const DroppableArea = ({ testMode = false }) => {
    const [level, setLevel] = useState('hard');
    const [images, setImages] = useState([]);
    const [neighborMap, setNeighborMap] = useState({});
    const [positions, setPositions] = useState({});
    const [relativePositions, setRelativePositions] = useState({});
    const originalPositionsRef = useRef({});
    const originalRelativePositionsRef = useRef({});
    const correctNeighborPositions = useRef({});
    const [loaded, setLoaded] = useState(false);

    const initializeRelativePositions = (map, imagesData) => {
        const relativePositions = imagesData.reduce((acc, img1) => {
            const neighbors = map[img1.key] || [];
            acc[img1.key] = neighbors.reduce((neighborAcc, neighborKey) => {
                const img2 = imagesData.find((img) => img.key === neighborKey);
                if (img2) {
                    const relativeX = img2.correctPosition.x - img1.correctPosition.x;
                    const relativeY = img2.correctPosition.y - img1.correctPosition.y;
                    neighborAcc[neighborKey] = { x: relativeX, y: relativeY };
                }
                return neighborAcc;
            }, {});
            return acc;
        }, {});
        originalRelativePositionsRef.current = relativePositions;
        updateRelativePositionsWithScale(calculateScaleFactor());
    };

    const updateRelativePositionsWithScale = (scalingFactor) => {
        const scaledRelativePositions = Object.keys(originalRelativePositionsRef.current).reduce((acc, key) => {
            acc[key] = Object.keys(originalRelativePositionsRef.current[key]).reduce((neighborAcc, neighborKey) => {
                const originalRelativePos = originalRelativePositionsRef.current[key][neighborKey];
                neighborAcc[neighborKey] = {
                    x: originalRelativePos.x * scalingFactor,
                    y: originalRelativePos.y * scalingFactor,
                };
                return neighborAcc;
            }, {});
            return acc;
        }, {});
        setRelativePositions(scaledRelativePositions);
    };

    const calculateCorrectNeighborPositions = (movedPieceKey, newPosition) => {
        const newCorrectPositions = {};
        const neighbors = neighborMap[movedPieceKey] || [];
        neighbors.forEach((neighborKey) => {
            if (relativePositions[movedPieceKey] && relativePositions[movedPieceKey][neighborKey]) {
                const relativePos = relativePositions[movedPieceKey][neighborKey];
                const correctX = newPosition.x + relativePos.x;
                const correctY = newPosition.y + relativePos.y;
                newCorrectPositions[neighborKey] = { x: correctX, y: correctY };
            }
        });
        correctNeighborPositions.current = { ...correctNeighborPositions.current, ...newCorrectPositions };
    };

    const handleImagesLoaded = (layout, loadedNeighborMap) => {
        if (loaded) return;

        const scaleFactor = calculateScaleFactor();
        const mappedImages = layout.map(({ key, correctPosition, size, src }) => ({
            key,
            src,
            correctPosition: {
                x: correctPosition.x * scaleFactor,
                y: correctPosition.y * scaleFactor,
            },
            size: {
                width: size.width * scaleFactor,
                height: size.height * scaleFactor,
            },
        }));
        setImages(mappedImages);
        setNeighborMap(loadedNeighborMap);
        setLoaded(true);

        initializeRelativePositions(loadedNeighborMap, layout);
        initializePositions(mappedImages, scaleFactor);
    };

    const initializePositions = (mappedImages, scaleFactor) => {
        const unscaledPositions = mappedImages.reduce((acc, img) => {
            acc[img.key] = testMode
                ? { x: img.correctPosition.x / scaleFactor, y: img.correctPosition.y / scaleFactor }
                : getRandomPosition();
            return acc;
        }, {});
        originalPositionsRef.current = unscaledPositions;

        setPositions(
            Object.keys(unscaledPositions).reduce((acc, key) => {
                acc[key] = {
                    x: unscaledPositions[key].x * scaleFactor,
                    y: unscaledPositions[key].y * scaleFactor,
                };
                return acc;
            }, {})
        );
    };

    useLayoutEffect(() => {
        const handleResize = () => {
            const scaleFactor = calculateScaleFactor();

            const updatedPositions = Object.keys(originalPositionsRef.current).reduce((acc, key) => {
                acc[key] = {
                    x: originalPositionsRef.current[key].x * scaleFactor,
                    y: originalPositionsRef.current[key].y * scaleFactor,
                };
                return acc;
            }, {});
            setPositions(updatedPositions);

            const scaledImages = images.map(image => ({
                ...image,
                size: {
                    width: image.size.width * scaleFactor,
                    height: image.size.height * scaleFactor,
                },
                correctPosition: {
                    x: image.correctPosition.x * scaleFactor,
                    y: image.correctPosition.y * scaleFactor,
                }
            }));
            setImages(scaledImages);

            updateRelativePositionsWithScale(scaleFactor);
            Object.keys(updatedPositions).forEach((key) => {
                calculateCorrectNeighborPositions(key, updatedPositions[key]);
            });
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, [images, neighborMap]);

    const handlePositionChange = (key, newPosition) => {
        setPositions((prevPositions) => {
            const newPositions = { ...prevPositions, [key]: newPosition };
            const scaleFactor = calculateScaleFactor();
            const newUnscaledX = Math.round(newPosition.x / scaleFactor);
            const newUnscaledY = Math.round(newPosition.y / scaleFactor);
            originalPositionsRef.current[key] = { x: newUnscaledX, y: newUnscaledY };

            calculateCorrectNeighborPositions(key, newPosition);

            const neighbors = neighborMap[key] || [];
            let didLock = false;

            neighbors.forEach((neighborKey) => {
                const neighborPosition = prevPositions[neighborKey];
                const relativePos = relativePositions[neighborKey]?.[key];

                if (relativePos) {
                    const correctX = neighborPosition.x + relativePos.x;
                    const correctY = neighborPosition.y + relativePos.y;
                    const distanceX = Math.abs(correctX - newPosition.x);
                    const distanceY = Math.abs(correctY - newPosition.y);

                    if (distanceX <= BASE_LOCK_THRESHOLD && distanceY <= BASE_LOCK_THRESHOLD && !didLock) {
                        newPositions[key] = { x: correctX, y: correctY };
                        didLock = true;
                        originalPositionsRef.current[key] = { x: correctX / scaleFactor, y: correctY / scaleFactor };
                    }
                }
            });
            return newPositions;
        });
    };

    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        setLoaded(false);
    };

    return (
        <div>
            <ImageLoader level={level} onImagesLoaded={handleImagesLoaded} />
            <LevelSelector onSelectLevel={handleLevelChange} />
            {images.map(({ key, src, correctPosition, size }) => (
                <DraggableImage
                    key={key}
                    src={src}
                    alt={`Puzzle Piece ${key}`}
                    initialPosition={correctPosition}
                    externalPosition={positions[key]}
                    size={size}
                    onPositionChange={(newPosition) => handlePositionChange(key, newPosition)}
                />
            ))}
        </div>
    );
};

export default DroppableArea;

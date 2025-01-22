import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import DraggableImage from './DraggableImage';
import LevelSelector from './LevelSelector';
import { ImageLoader } from './ImageLoader';
import './DroppableArea.css';

const BASE_SCREEN_WIDTH = 11520;
const BASE_LOCK_THRESHOLD = 30;

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
    const [level, setLevel] = useState('easy');
    const [images, setImages] = useState([]);
    const [neighborMap, setNeighborMap] = useState({});
    const [positions, setPositions] = useState({});
    const [relativePositions, setRelativePositions] = useState({});
    const originalPositionsRef = useRef({});
    const originalRelativePositionsRef = useRef({});
    const correctNeighborPositions = useRef({});
    const [loaded, setLoaded] = useState(false);
    const [lockedGroups, setLockedGroups] = useState([]); // State to track locked groups

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
        console.log("Scaled images");
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

    const handlePositionChange = (key, newPosition, isReleased = false) => {
        setPositions((prevPositions) => {
            const newPositions = { ...prevPositions, [key]: newPosition };
            const scaleFactor = calculateScaleFactor();
    
            // Find the group containing the dragged piece
            const draggedGroup = lockedGroups.find((group) => group.includes(key)) || [key];
    
            // Calculate the movement delta
            const deltaX = newPosition.x - prevPositions[key].x;
            const deltaY = newPosition.y - prevPositions[key].y;
    
            // Move all pieces in the dragged group during dragging
            draggedGroup.forEach((groupKey) => {
                if (groupKey !== key) {
                    newPositions[groupKey] = {
                        x: prevPositions[groupKey].x + deltaX,
                        y: prevPositions[groupKey].y + deltaY,
                    };
    
                    // Update reference positions
                    originalPositionsRef.current[groupKey] = {
                        x: Math.round(newPositions[groupKey].x / scaleFactor),
                        y: Math.round(newPositions[groupKey].y / scaleFactor),
                    };
                }
            });
    
            if (isReleased) {
                const updatedGroup = new Set(draggedGroup); // Use a set to avoid duplicates
                let lockedToNeighbor = false; // Flag to prevent multiple locks
    
                // Check all pieces in the dragged group for locking
                draggedGroup.forEach((draggedKey) => {
                    if (lockedToNeighbor) return; // Skip further locking if already locked
    
                    const neighbors = neighborMap[draggedKey] || [];
                    for (const neighborKey of neighbors) {
                        if (lockedToNeighbor) break; // Skip further neighbors if locked
    
                        const neighborPosition = prevPositions[neighborKey];
                        const relativePos = relativePositions[neighborKey]?.[draggedKey]; // Relative position from neighbor to draggedKey
    
                        if (relativePos) {
                            const correctX = neighborPosition.x + relativePos.x;
                            const correctY = neighborPosition.y + relativePos.y;
                            const distanceX = Math.abs(correctX - newPositions[draggedKey].x);
                            const distanceY = Math.abs(correctY - newPositions[draggedKey].y);
    
                            if (distanceX <= BASE_LOCK_THRESHOLD && distanceY <= BASE_LOCK_THRESHOLD) {
                                // Align the dragged group to the neighbor group
                                const neighborGroup =
                                    lockedGroups.find((group) => group.includes(neighborKey)) || [neighborKey];
    
                                // Calculate the alignment offset
                                const alignmentOffset = {
                                    x: correctX - newPositions[draggedKey].x,
                                    y: correctY - newPositions[draggedKey].y,
                                };
    
                                // Adjust positions of all members in the dragged group
                                draggedGroup.forEach((groupMember) => {
                                    newPositions[groupMember] = {
                                        x: prevPositions[groupMember].x + alignmentOffset.x,
                                        y: prevPositions[groupMember].y + alignmentOffset.y,
                                    };
                                    originalPositionsRef.current[groupMember] = {
                                        x: Math.round(newPositions[groupMember].x / scaleFactor),
                                        y: Math.round(newPositions[groupMember].y / scaleFactor),
                                    };
                                });
    
                                // Add all members of the neighbor group to the updated group
                                neighborGroup.forEach((neighborMember) => updatedGroup.add(neighborMember));
    
                                console.log(
                                    `Locked dragged piece (${draggedKey}) to neighbor (${neighborKey}). Groups merged.`
                                );
    
                                lockedToNeighbor = true; // Mark as locked
                                break; // Stop checking other neighbors
                            }
                        }
                    }
                });
    
                // Update locked groups
                setLockedGroups((prevGroups) => {
                    const groupsToMerge = prevGroups.filter((group) =>
                        group.some((member) => updatedGroup.has(member))
                    );
    
                    const mergedGroup = groupsToMerge.reduce(
                        (acc, group) => new Set([...acc, ...group]),
                        updatedGroup
                    );
    
                    // Remove merged groups and add the new merged group
                    return [
                        ...prevGroups.filter((group) => !groupsToMerge.includes(group)),
                        Array.from(mergedGroup),
                    ];
                });
            }
    
            return newPositions;
        });
    };
    
    
    const handleLevelChange = (newLevel) => {
        setLevel(newLevel);
        setLoaded(false);
        setLockedGroups([]);
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
                    onPositionChange={(newPosition, isReleased) => handlePositionChange(key, newPosition, isReleased)}
                />
            ))}
        </div>
    );
};

export default DroppableArea;
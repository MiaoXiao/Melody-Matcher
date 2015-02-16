# CS100-Music-Game-

## Team members: 
* Rica Feng (rfeng001@ucr.edu)
* Sherina Bala (sbala003@ucr.edu)
* Stanley Ari Cohen (scohe001@ucr.edu)

## Goal: 
Create a web based video game where the player has to distinguish between different tones. 
This will help players better distinguish between different tones and sounds and will also help players new to music, learn different scales.

## Requires 
* A working browser

## Basic Gameplay:
The player will hear a melody, and will try to replicate that melody as quickly as possible by clicking piano keys on a virtual keyboard. 
But you only have a certain amount of time, once you replicate the melody the time is reset. If the time reaches 0, they lose.
The player will be able to see a keyboard representation with all the keys labeled with its corresponding key note.
Instead of clicking, the player can also type “p” to play the melody and can also type ‘q’ through ‘o’ to “play” the piano.
Difficulty of a melody is based on number of the tones in a melody, speed of the melody, and range of tones in melody.
The game ends when they player runs out of time before they can replicate a melody. After the game, their progress/stats for that game is shown.

## Choosing a Level:
The player can choose 1 out of 3 levels, Easy, Medium, Hard. 
All levels will increase in difficulty based on how many melodies are successfully replicated. 
So an easy level will eventually reach hard difficulty. 

Score Calculation:
When a player successfully replicates a melody a score is given:
	
``ExtraPoints = TotalTime - TimeTaken;``

``Score = BasePoints + ExtraPoints;``

BasePoints is how many points a melody is worth. (Basepoints calculated on how many tones the melody has, or how fast it is)
TotalTimeLeft is how many seconds left until the player must replicate a melody, or else they lose. 
TotalTime is reset to a fixed number every time a melody is replicated.
TimeTaken is how many seconds it took the player to find the correct melody.

## Melodies:
All Melodies are randomly generated, given a couple parameters such as number of tones, speed of melody, and range of melody. 
The player can choose from a preset of sounds when they play the game, the default being the piano.

## Statistics:
Scores on all levels, and current progress will be saved in a cookie. They can be viewed from the stats screen.

#!/usr/bin/python3 

from  maze_map import BinaryTreeNode, root


def get_move_choice(current_path: str, player_help: bool) -> str:
    """
    Prints the corresponding text to guide the player.
    Prompts the player for the next move.
    Returns the validated direction: 'l', 'r', or 'b'.
    """

    print("""|<--|  |--> |
  L      R

      o
     /█\\  
     / \\  """)
    print("Your current path:")
    print(current_path)
    
    if player_help == True:
        guess = input("Invalid input. Use only 'L', 'R', or 'B'.").lower()
    else:
         guess = input("Where to go: ").lower()

    if guess not in ['l', 'r', 'b']:
        guess = None

    print("\033[2J\033[H", end="")  # Clear the screen
    return guess
    

def mazeGame(node: BinaryTreeNode) -> None:
    """Takes the node the player is currently in and the path the player has taken as input.
The function then asks the player for a guess and traverses the given path.
If the exit has not been found, the function will run recursively. """

    print("""You wake up in darkness. The air is damp, and the faint echo of your own breath bounces off unseen walls. A dull glow reveals the stone corridors stretching endlessly before you. The maze.

Somewhere within this labyrinth lies the flag, the only proof that you have conquered its winding paths. But there’s only one way out, and the maze will not make it easy.

The rules are simple: you move forward until you reach a fork. Left or right? The choice is yours, but be warned—the corridors twist and loop upon themselves. Take the wrong turn too many times, and you may never find your way out.

To survive, you must keep track of your path in your notebook. Every step you take, every choice you make—it all matters. And should you ever feel lost, remember: you've left your jacket at the start. If you backtrack carefully, you will always find your way to where it all began.

The flag awaits. The maze dares you to escape. Will you find the path… or be lost forever?""")
    
    path = ""

    while node.is_exit==False:
          
          if node.message != None:
              print(node.message)
          guess = get_move_choice(path, False)
          
          if guess == None:
              guess = get_move_choice(path, True)
          if guess == "r":
            node = node.right
            path += "R"
          elif guess == "l" :
            node = node.left
            path += "L"
          elif guess == "b":
              node = root  # Backtrack to the start
              path = ""
              
    print(node.message)
    print("you took the following path to get out: " + path)
                
          
# ----------- main -------------- 
if __name__ == '__main__':
    mazeGame(root)

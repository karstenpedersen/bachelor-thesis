class BinaryTreeNode:
    def __init__(self, value, is_exit=False):
        self.value = value
        self.left = None
        self.right = None
        self.message = None
        self.is_exit = is_exit

    def insert_left(self, child):
        self.left = child

    def insert_right(self, child):
        self.right = child
        
    def insert_message(self, message):
        self.message = message



root = BinaryTreeNode(0)
a1 = BinaryTreeNode(1)
a2 = BinaryTreeNode(2)
a3 = BinaryTreeNode(3)
a4 = BinaryTreeNode(4)
a5 = BinaryTreeNode(5)
a6 = BinaryTreeNode(6)
a7 = BinaryTreeNode(7)
a8 = BinaryTreeNode(8)
a9 = BinaryTreeNode(9)
a9.insert_message("You’re scared. You’ll never escape this maze. It seems endless. Are you just going in circles?")
a10 = BinaryTreeNode(10)
a11 = BinaryTreeNode(11)
a12 = BinaryTreeNode(12)
# a13 = BinaryTreeNode(13, is_exit=True)
a13 = BinaryTreeNode(13)

a14 = BinaryTreeNode(14)
a15 = BinaryTreeNode(15)
a15.insert_message("You are going the wrong way!")
a16 = BinaryTreeNode(16)
a17 = BinaryTreeNode(17)
a18 = BinaryTreeNode(18)
a19 = BinaryTreeNode(19)
a20 = BinaryTreeNode(20)
a21 = BinaryTreeNode(21, is_exit=True)
a22 = BinaryTreeNode(20)
a23 = BinaryTreeNode(20)
a24 = BinaryTreeNode(20)
a21.insert_message("you win the flag is flag{ILoveFlags}")





root.insert_left(a1) 
root.insert_right(a2)

a1.insert_left(a3)  
a1.insert_right(a4)

a2.insert_left(a5)  
a2.insert_right(a6)

a3.insert_left(a7)  
a3.insert_right(a8)

a4.insert_left(a8)  
a4.insert_right(a9)

a5.insert_left(a9)  
a5.insert_right(a3)

a6.insert_left(a10)  
a6.insert_right(a14)

a7.insert_left(a1)  
a7.insert_right(a1)

a8.insert_left(a7)  
a8.insert_right(a1)

a9.insert_left(a7)  
a9.insert_right(a8)

a10.insert_left(a11)  
a10.insert_right(a1)

a11.insert_left(a9)  
a11.insert_right(a12)

a12.insert_left(a13)  
a12.insert_right(a9)

a13.insert_left(a16)  
a13.insert_right(a9)

a16.insert_left(a1)  
a16.insert_right(a17)

a17.insert_left(a18)  
a17.insert_right(a1)

a18.insert_left(a19)  
a18.insert_right(a1)

a19.insert_left(a1)  
a19.insert_right(a20)

a20.insert_left(a1)  
a20.insert_right(a21)

a14.insert_left(a15)  
a14.insert_right(a15)

a15.insert_left(a5)  
a15.insert_right(a5)

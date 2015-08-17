# -*- coding: utf-8 -*-
import os, sys
sys.path.append(os.getcwd())


from model.user import User


def createAdmin():
    User.new_admin("admin", "nimda")


if __name__ == '__main__':
    createAdmin()

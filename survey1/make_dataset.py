import os
import json
from argparse import ArgumentParser


def get_args():
    description = '画像パスとラベルを紐付けたデータを作成します'
    parser = ArgumentParser(description=description)
    parser.add_argument('path_root_src', type=str, help='画像ディレクトリ')
    return parser.parse_args()


def to_dirname(name):
    if name[-1:] == '/':
        return name
    else:
        return name + '/'


def check_ext(name):
    ext = os.path.splitext(name)[1]
    if ext == '.jpg' or ext == '.png' or ext == '.gif':
        return True
    else:
        return False


def get_file_data(path):
    data = {}
    for name in os.listdir(path):
        if os.path.isfile(path+name):
            continue
        data[name] = []
        i = 0
        for file in os.listdir(path+name):
            if check_ext(file):
                data[name].append(path + name + '/' + file)
                i = i + 1
    return data


def check_val(length):
    b_len = length[0]
    for n in length:
        if b_len != n:
            return False
    return True


def generate_data(data):
    output = json.dumps(data, indent=4)
    with open('files.json', 'w') as f:
        f.write(output)


def main():
    args = get_args()
    path = to_dirname(args.path_root_src)
    data = get_file_data(path)
    length = []
    print('"'+str(path)+'"内にファイルが見つかりました')
    for label in data:
        print(label, end=' - ')
        print(len(data[label]), end="枚\n")
        length.append(len(data[label]))
    print('')
    if check_val(length) == False:
        print('【警告】画像数が一致していません')
    choice = input("データを作成しますか？ [y/N]: ").rstrip()
    if choice in ['y', 'ye', 'yes']:
        generate_data(data)
        print('"files.json"を作成しました')
    else:
        exit()


if __name__ == '__main__':
    main()
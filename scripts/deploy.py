import subprocess

import click

from scripts.update_version import update_version


@click.group()
def deploy():
    pass


@deploy.command()
@click.option(
    '-v',
    '--version',
    "version",
    default="patch",
    type=click.types.Choice(["major", "minor", "patch"], case_sensitive=False),
)
def deploy_web(version):
    # TODO actually fix this so it just works lmao
    index = {"major": 0, "minor": 1, "patch": 2}[version]
    print(version, index)

    update_version(index)

    for i in range(index + 1, 3):
        print(i)
        update_version(i, None, 0)
    try:
        subprocess.check_call("npm run deploy-web", shell=True)
        # raise subprocess.CalledProcessError(1, "npm deploy-web")
    except (subprocess.CalledProcessError, KeyboardInterrupt) as e:
        try:
            print("return error code:", e.returncode)
        except Exception:
            pass
        update_version(index, -1)


if __name__ == '__main__':
    deploy()

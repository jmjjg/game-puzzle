#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

#-----------------------------------------------------------------------------------------------------------------------

__FILE__="$(realpath "$0")"
__SCRIPT__="$(basename "${__FILE__}")"
__ROOT__="$(dirname "${__FILE__}")"
__ROOT__="$(realpath "${__ROOT__}")"

DEBUG=0

#-----------------------------------------------------------------------------------------------------------------------

docker_compose_clear_image()
{
    local image="${1}"

    set +o errexit
    (
        echo "Clearing image ${image}... " \
        && docker image rmi -f "${image}" > /dev/null 2>&1 \
        && docker image prune -f > /dev/null 2>&1 \
    )

    code=$?
    set -o errexit

    if [ $code -ne 0 ] ; then
        echo >&2 "Error while clearing image ${image} ($code)"
    fi

    return $code
}

docker_compose_clear()
{
    set +o errexit
    (
        for service in `docker-compose config --services | sort` ; do
          docker_compose_clear_image "${service}"
        done
    )

    code=$?
    set -o errexit

    if [ $code -ne 0 ] ; then
        echo >&2 "Error while clearing all images ($code)"
    fi

    return $code
}

docker_compose_up_down()
{
    set +o errexit
    (
        echo "Restarting..." \
        && docker-compose down -v --remove-orphans \
        && docker-compose up \
        && docker-compose down -v --remove-orphans \
    )

    code=$?
    set -o errexit

    if [ $code -ne 0 ] ; then
        echo >&2 "Error while restarting ${project_name} ($code)"
    fi

    return $code
}

#-----------------------------------------------------------------------------------------------------------------------


usage()
{
    printf "NAME\n"
    printf "  %s\n" "$__SCRIPT__"
    printf "\nDESCRIPTION\n"
    printf "  @todo\n"
    printf "\nSYNOPSIS\n"
    printf "  %s [OPTION] [COMMAND]\n" "$__SCRIPT__"
    printf "\nCOMMANDS\n"
    printf "  clear\t@todo\n"
    printf "  watch\t@todo\n"
    printf "\nOPTIONS\n"
    printf "  --clear\t@todo\n"
    printf "  -d|--debug\t@todo(set -o xtrace)\n"
    printf "  -h|--help\t@todo\n"
    printf "\nEXEMPLES\n"
    printf "  %s -h\n" "$__SCRIPT__"
    printf "  %s clear\n" "$__SCRIPT__"
    printf "  %s watch --clear\n" "$__SCRIPT__"
}

main()
{
    (
        opts=$(getopt --longoptions clear,debug,help -- d "$@") || (usage >&2 ; exit 1)
        eval set -- "$opts"
        while true; do
            case "${1}" in
                --clear)
                    docker_compose_clear
                    shift
                    ;;
                -d|--debug)
                    DEBUG=1
                    shift
                    ;;
                -h|--help)
                    usage
                    exit 0
                    ;;
                --)
                    shift
                    break
                    ;;
            esac
        done

        if [ $DEBUG -eq 1 ]; then
            set -o xtrace
        fi

        case "${1:-}" in
            clear)
                docker_compose_clear
                exit $?
            ;;
            watch)
                docker_compose_up_down
                exit $?
            ;;
            --)
                shift
                break
            ;;
            *)
                >&2 usage
                exit 1
            ;;
        esac

        exit 0
    )
}

main "$@"
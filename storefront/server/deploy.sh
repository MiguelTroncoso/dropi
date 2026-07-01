#!/usr/bin/env bash
# Despliega dropi-cod-server en este servidor (VPS) con Docker.
#
# Uso (corre esto TÚ, por SSH, en tu VPS — no lo corras en tu máquina local):
#   ./deploy.sh https://github.com/tu-usuario/dropi.git
#
# La primera vez, si no existe .env, el script se detiene y te avisa para
# que lo completes (no continúa con un .env vacío, para no levantar el
# contenedor sin credenciales reales).
#
# Es idempotente: si el repo ya existe, hace `git pull` en vez de clonar de
# nuevo, y si el contenedor ya está corriendo, lo reemplaza por la versión
# nueva sin dejar dos corriendo a la vez.

set -euo pipefail

REPO_URL="${1:-}"
DIR="dropi"
CONTAINER_NAME="dropi-cod-server"
IMAGE_NAME="dropi-cod-server"
PORT="${PORT:-3000}"

if [ -d "$DIR/.git" ]; then
  echo "Repo ya existe en ./$DIR, actualizando..."
  git -C "$DIR" pull
else
  if [ -z "$REPO_URL" ]; then
    echo "Error: no existe ./$DIR y no pasaste la URL del repo."
    echo "Uso: ./deploy.sh https://github.com/tu-usuario/dropi.git"
    exit 1
  fi
  echo "Clonando repo..."
  git clone "$REPO_URL" "$DIR"
fi

cd "$DIR/storefront/server"

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "=========================================================="
  echo "Se creó storefront/server/.env desde el ejemplo, PERO está"
  echo "vacío. Complétalo con tus credenciales reales:"
  echo ""
  echo "  nano .env"
  echo ""
  echo "Ver storefront/server/README.md para saber exactamente qué"
  echo "credencial va en cada variable. Vuelve a correr este script"
  echo "una vez que lo hayas completado."
  echo "=========================================================="
  exit 1
fi

echo "Construyendo imagen Docker..."
docker build -t "$IMAGE_NAME" .

if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}\$"; then
  echo "Deteniendo y eliminando contenedor anterior..."
  docker rm -f "$CONTAINER_NAME"
fi

echo "Levantando contenedor nuevo en el puerto $PORT..."
docker run \
  --env-file .env \
  -p "${PORT}:3000" \
  -d \
  --restart unless-stopped \
  --name "$CONTAINER_NAME" \
  "$IMAGE_NAME"

echo ""
echo "Listo. Verifica con:"
echo "  curl http://localhost:${PORT}/salud"
echo "  docker logs -f $CONTAINER_NAME"

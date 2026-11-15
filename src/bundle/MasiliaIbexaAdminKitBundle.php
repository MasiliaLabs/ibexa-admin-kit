<?php

declare(strict_types=1);

namespace Masilia\Bundle\IbexaAdminKit;

use Symfony\Component\HttpKernel\Bundle\Bundle;

/**
 * Nothing to wire in PHP: the bundle exists so that Ibexa's Encore configuration finds what it ships (Resources/encore), which is
 * the alias "@masilia-admin-kit" of the React components of the admin pages of the Masilia packages.
 */
final class MasiliaIbexaAdminKitBundle extends Bundle
{
}

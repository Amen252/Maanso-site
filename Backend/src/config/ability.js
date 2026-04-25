import { AbilityBuilder, Ability } from '@casl/ability';

export default function defineAbilitiesFor(user) {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (!user) {
    can('read', 'Gabay');
    return build();
  }

  if (user.role === 'Admin') {
    can('manage', 'all');
  } else if (user.role === 'Abwaan') {
    can('read', 'Gabay');
    can('create', 'Gabay');
    can(['update', 'delete'], 'Gabay', { author: user._id });
  } else if (user.role === 'Viewer') {
    can('read', 'Gabay');
    cannot(['create', 'update', 'delete'], 'all');
  }

  return build();
}

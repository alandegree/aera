"""add-tidb-auth-binding

Revision ID: 0251a1c768cc
Revises: 63a83fcf12ba
Create Date: 2024-08-15 09:56:59.012490

"""
import sqlalchemy as sa
from alembic import op

import models as models

# revision identifiers, used by Alembic.
revision = '0251a1c768cc'
down_revision = 'bbadea11becb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('tidb_auth_bindings',
    sa.Column('id', models.types.StringUUID(), server_default=sa.text('uuid_generate_v4()'), nullable=False),
    sa.Column('tenant_id', models.types.StringUUID(), nullable=True),
    sa.Column('cluster_id', sa.String(length=255), nullable=False),
    sa.Column('cluster_name', sa.String(length=255), nullable=False),
    sa.Column('active', sa.Boolean(), server_default=sa.text('false'), nullable=False),
    sa.Column('status', sa.String(length=255), server_default=sa.text("'CREATING'::character varying"), nullable=False),
    sa.Column('account', sa.String(length=255), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), server_default=sa.text('CURRENT_TIMESTAMP(0)'), nullable=False),
    sa.PrimaryKeyConstraint('id', name='tidb_auth_bindings_pkey')
    )
    with op.batch_alter_table('tidb_auth_bindings', schema=None) as batch_op:
        batch_op.create_index('tidb_auth_bindings_active_idx', ['active'], unique=False)
        batch_op.create_index('tidb_auth_bindings_status_idx', ['status'], unique=False)
        batch_op.create_index('tidb_auth_bindings_created_at_idx', ['created_at'], unique=False)
        batch_op.create_index('tidb_auth_bindings_tenant_idx', ['tenant_id'], unique=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('tidb_auth_bindings', schema=None) as batch_op:
        batch_op.drop_index('tidb_auth_bindings_tenant_idx')
        batch_op.drop_index('tidb_auth_bindings_created_at_idx')
        batch_op.drop_index('tidb_auth_bindings_active_idx')
        batch_op.drop_index('tidb_auth_bindings_status_idx')
    op.drop_table('tidb_auth_bindings')
    # ### end Alembic commands ###

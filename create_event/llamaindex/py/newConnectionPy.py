def setup_account_connection(entity_id, app_name, toolset):
    entity = toolset.get_entity(id = entity_id)
    try:
        connection_details = entity.get_connection(app=app_name) 
    except Exception as e:
        connection = toolset.initiate_connection(entity_id=entity_id, app=app_name)
        print(f"\nPlease connect your {app_name[0].upper() + app_name[1:]} account by clicking on the below link:\n\n`,{connection.redirectUrl}");
        connection.wait_until_active(client = toolset.client, timeout=60)
        connection_details = entity.get_connection(app=app_name)
    
    return connection_details